
import ftplib
import sys

def check_root(host, user, passwd):
    try:
        ftp = ftplib.FTP(host)
        ftp.login(user=user, passwd=passwd)
        
        print(f"Current PWD: {ftp.pwd()}")
        
        print("Listing files in ROOT:")
        files = []
        ftp.dir(files.append)
        
        for f in files:
            print(f)
            
        ftp.quit()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_root("92.112.189.250", "u384342620.insydetradar.com", "Aprilia100!69.")
