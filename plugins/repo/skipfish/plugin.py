#!/usr/bin/env python
# -*- coding: utf-8 -*-

'''
Faraday Penetration Test IDE
Copyright (C) 2013  Infobyte LLC (http://www.infobytesec.com/)
See the file 'doc/LICENSE' for the license information

'''
from __future__ import with_statement
from plugins import core
import re
import os
import sys
import json
import socket
import random

current_path = os.path.abspath(os.getcwd())

__author__ = "Nicolas Rodriguez"
__copyright__ = "Copyright (c) 2013, Infobyte LLC"
__credits__ = ["Nicolas Rodriguez"]
__license__ = ""
__version__ = "1.0.0"
__maintainer__ = "Francisco Amato"
__email__ = "famato@infobytesec.com"
__status__ = "Development"


class SkipfishParser(object):
    """
    The objective of this class is to parse an xml file generated by
    the skipfish tool.

    TODO: Handle errors.
    TODO: Test skipfish output version. Handle what happens if the parser
    doesn't support it.
    TODO: Test cases.

    @param skipfish_filepath A proper xml generated by skipfish
    """

    def __init__(self, skipfish_filepath):
        self.filepath = skipfish_filepath

        tmp = open(skipfish_filepath + "/samples.js", "r").read()
        data = self.extract_data(
                    tmp,
                    "var issue_samples =", "];",
                    lambda x: x.replace("'", '"'),
                    False,
                    False)
        # Escape characters not allowed in JSON, repr fix this with double Escape
        # Also remove \n character and space for have a valid JSON.
        issues = json.loads(repr(data[1]).replace("\\n"," ").replace("'","") + "]")

        tmp = open(skipfish_filepath + "/index.html", "r").read()
        err_msg = json.loads(
            self.extract_data(
                tmp,
                "var issue_desc=",
                "};",
                lambda x: self.convert_quotes(x, "'", '"'),
                False,
                False)
            [1] + "}")

        self.err_msg = err_msg
        self.issues = issues

    def convert_quotes(self, text, quote="'", inside='"'):
        start = 0
        while True:
            pos = text.find(quote, start)

            if pos == -1:
                break

            ss = text[:pos - 1]
            quotes = len(ss) - len(ss.replace(inside, ""))

            if quotes % 2 == 0:
                text = text[:pos - 1] + "\\" + quote + text[pos + 1:]

            start = pos + 1
        return text

    def extract_data(self, samples, start_tag, end_tag, fn=lambda x: x, include_start_tag=True, include_end_tag=True):
        start = samples.find(start_tag)

        if start == -1:
            return (-1, None)

        end = samples.find(end_tag, start + 1)

        if end == -1:
            return (-2, None)

        data = samples[start:end + len(end_tag)]
        data = fn(data)

        if not include_start_tag:
            data = data[len(start_tag) + 1:]

        if not include_end_tag:
            data = data[:-1 * len(end_tag)]

        return (0, data)


class SkipfishPlugin(core.PluginBase):
    """
    Example plugin to parse skipfish output.
    """

    def __init__(self):
        core.PluginBase.__init__(self)
        self.id = "Skipfish"
        self.name = "Skipfish XML Output Plugin"
        self.plugin_version = "0.0.2"
        self.version = "2.1.5"
        self.options = None
        self._current_output = None
        self.parent = None
        self._command_regex = re.compile(
            r'^(sudo skipfish|skipfish|sudo skipfish\.pl|skipfish\.pl|perl skipfish\.pl|\.\/skipfish\.pl|\.\/skipfish).*?')
        global current_path

    def parseOutputString(self, output, debug=False):
        """
        This method will discard the output the shell sends, it will read it
        from the xml where it expects it to be present.

        NOTE: if 'debug' is true then it is being run from a test case and the
        output being sent is valid.
        """

        if not os.path.exists(self._output_path):
            return False

        p = SkipfishParser(self._output_path)

        hostc = {}
        port = 80
        for issue in p.issues:
            req = ""
            res = ""
            for sample in issue["samples"]:
                if not sample["url"] in hostc:
                    reg = re.search(
                        "(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))[\:]*([0-9]+)*([/]*($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+)).*?$", sample["url"])

                    protocol = reg.group(1)
                    host = reg.group(4)
                    if reg.group(11) is not None:
                        port = reg.group(11)
                    else:
                        port = 443 if protocol == "https" else 80

                    ip = self.resolve(host)

                    h_id = self.createAndAddHost(ip)
                    i_id = self.createAndAddInterface(
                        h_id,
                        ip,
                        ipv4_address=ip,
                        hostname_resolution=host)

                    s_id = self.createAndAddServiceToInterface(
                        h_id,
                        i_id,
                        "http",
                        "tcp",
                        ports=[port],
                        status="open")

                    n_id = self.createAndAddNoteToService(
                        h_id,
                        s_id,
                        "website",
                        "")

                    self.createAndAddNoteToNote(h_id, s_id, n_id, host, "")

                    hostc[sample["url"]] = {
                        'h_id': h_id,
                        'ip': ip,
                        'port': port,
                        'host': host,
                        'protocol': protocol,
                        'i_id': i_id,
                        's_id': s_id}

                try:
                    req = open("%s/request.dat" % sample["dir"], "r").read()
                except:
                    pass

                try:
                    res = open("%s/request.dat" % sample["dir"], "r").read()
                except:
                    pass

                d = hostc[sample["url"]]
                self.createAndAddVulnWebToService(
                    d['h_id'],
                    d['s_id'],
                    name=p.err_msg[str(issue["type"])],
                    desc="Extra: " + sample["extra"],
                    website=d['host'],
                    path=sample["url"],
                    severity=issue["severity"])

    def resolve(self, host):
        try:
            return socket.gethostbyname(host)
        except:
            pass
        return host

    xml_arg_re = re.compile(r"^.*(-o\s*[^\s]+).*$")

    def processCommandString(self, username, current_path, command_string):
        """
        Adds the -o parameter to get report of the command string that the
        user has set.
        """
        arg_match = self.xml_arg_re.match(command_string)

        self._output_path = os.path.join(
            self.data_path,
            "skipfish_output-%s" % random.uniform(1, 10))

        if arg_match is None:
            return re.sub(
                r"(^.*?skipfish)",
                r"\1 -o %s" % self._output_path,
                command_string,
                1)
        else:
            return re.sub(
                arg_match.group(1),
                r"-o %s" % self._output_path,
                command_string,
                1)

    def setHost(self):
        pass


def createPlugin():
    return SkipfishPlugin()

if __name__ == '__main__':
    parser = SkipfishParser(sys.argv[1])
    for item in parser.items:
        if item.status == 'up':
            print item
