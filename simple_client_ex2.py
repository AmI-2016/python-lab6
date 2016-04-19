'''
Created on Apr 04, 2016
Copyright (c) 2015-2016 Teodoro Montanaro

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License
@author: tmontanaro
'''


import requests
import json


def print_tasks_from_server():
    '''
    Get the list of tasks from the server in JSON
    '''

    #get JSON from server
    resp = requests.get('http://127.0.0.1:5000/api/v1.0/tasks')
    if resp.status_code != 200:
        print "Error: the list of tasks is not available at this moment."
    else:
        #for each element in tasks we print the content
        for task in json.loads(resp.text)['tasks']:
            print task['description'] + " " +str(task['urgent'])


if __name__ == '__main__':
    # main program
    print_tasks_from_server()