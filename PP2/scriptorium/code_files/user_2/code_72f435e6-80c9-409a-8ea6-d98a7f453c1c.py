import os
import socket
try:
    print("Testing Internet Access... \n", flush=True)
    socket.create_connection(("www.google.com", 80), timeout=1)
    internet_access = True
except socket.error:
    internet_access = False

print("Internet Access: ", internet_access, " \n", flush=True)

try:
    # TODO: Replace with TAs home file path
    with open("/home/alessialinux/Desktop/hi.txt", "r") as f:
        print(f.read(), flush=True)
except Exception as e:
    print(f"Access denied: {e} ", flush=True)

print("Starting infinite loop...")
while True:
    pass