#!/usr/bin/env python3
"""
create_kvm.py
Usage:
  apigee_kvm (--env=<env>) (--access-token=<access-token>) [--org=<org>] create <name>
  apigee_kvm (--env=<env>) (--access-token=<access-token>) [--org=<org>] delete <name>
  apigee_kvm (--env=<env>) (--access-token=<access-token>) [--org=<org>] replace-entry <name> (--key=<key>) \
(--value=<value>)
  apigee_kvm (--env=<env>) (--access-token=<access-token>) [--org=<org>] remove-entry <name> (--key=<key>)

Options:
  -h --help                           Show this screen.
  -t --access-token=<access-token>    Apigee access token
  --env=<env>                         Apigee environment
  --org=<org>                         Apigee organisation [default: nhsd-nonprod]
  -k --key=<key>                      KVM key
  -v --value=<value>                  KVM value
"""
import json

import requests
from docopt import docopt


class ApigeeKvm:
    def __init__(self, env: str, access_token: str, org="nhsd-nonprod") -> None:
        self.base_kvm_url = f"https://api.enterprise.apigee.com/v1/organizations/{org}/environments/{env}/keyvaluemaps"
        self.headers = {
            "Authorization": f"Bearer {access_token}"
        }

    def get_kvm(self, kvm_name: str):
        url = f"{self.base_kvm_url}/{kvm_name}"
        res = requests.get(url, headers=self.headers)
        if res.status_code == 200:
            return res.content
        if res.status_code == 404:
            return None
        else:
            print(f"Bad response from apigee: status code: {res.status_code} content: {res.content}")
            exit(1)

    def create_kvm(self, kvm_name: str):
        url = f"{self.base_kvm_url}"
        payload = {"name": kvm_name}
        res = requests.post(url, json=payload, headers=self.headers)
        if res.status_code == 201:
            return res.content
        if res.status_code == 409:
            return self.get_kvm(kvm_name)
        else:
            print(f"Bad response from apigee: status code: {res.status_code} content: {res.content}")
            exit(1)

    def delete_kvm(self, kvm_name: str):
        url = f"{self.base_kvm_url}/{kvm_name}"
        res = requests.delete(url, headers=self.headers)
        if res.status_code == 200:
            return res.content
        if res.status_code == 404:
            return None
        else:
            print(f"Bad response from apigee: status code: {res.status_code} content: {res.content}")
            exit(1)

    def get_entry(self, kvm_name: str, key: str):
        url = f"{self.base_kvm_url}/{kvm_name}/entries/{key}"
        res = requests.get(url, headers=self.headers)
        if res.status_code == 200:
            return res.content
        if res.status_code == 404:
            return None
        else:
            print(f"Bad response from apigee: status code: {res.status_code} content: {res.content}")
            exit(1)

    def replace_entry(self, kvm_name: str, key: str, value: str):
        url = f"{self.base_kvm_url}/{kvm_name}/entries"
        payload = {"name": key, "value": value}
        res = requests.post(url, json=payload, headers=self.headers)
        if res.status_code == 201:
            return res.content
        if res.status_code == 409:
            self.remove_entry(kvm_name, key)
            return self.replace_entry(kvm_name, key, value)
        else:
            print(f"Bad response from apigee: status code: {res.status_code} content: {res.content}")
            exit(1)

    def remove_entry(self, kvm_name: str, key: str):
        url = f"{self.base_kvm_url}/{kvm_name}/entries/{key}"
        res = requests.delete(url, headers=self.headers)
        if res.status_code == 200:
            return res.content
        if res.status_code == 404:
            return None
        else:
            print(f"Bad response from apigee: status code: {res.status_code} content: {res.content}")
            exit(1)


def main():
    args = docopt(__doc__)
    apigee = ApigeeKvm(env=args["--env"], access_token=args["--access-token"], org=args["--org"])

    kvm_name = args["<name>"]
    res = b""
    if args.get("create"):
        res = apigee.create_kvm(kvm_name)
    elif args.get("delete"):
        res = apigee.delete_kvm(kvm_name)
    elif args.get("replace-entry"):
        res = apigee.replace_entry(kvm_name, args["--key"], args["--value"])
    elif args.get("remove-entry"):
        res = apigee.remove_entry(kvm_name, args["--key"])
    else:
        print("Operation not supported")
        exit(1)

    content = json.loads(res)
    print(content)


if __name__ == '__main__':
    main()
