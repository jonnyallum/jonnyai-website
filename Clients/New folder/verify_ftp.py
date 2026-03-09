
import ftplib
import sys

def check_files(host, user, passwd, remote_dir):
    try:
        ftp = ftplib.FTP(host)
        ftp.login(user=user, passwd=passwd)
        ftp.cwd(remote_dir)
        
        print(f"Listing files in {remote_dir}:")
        files = []
        ftp.dir(files.append)
        
        for f in files:
            print(f)
            
        ftp.quit()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_files("92.112.189.250", "u384342620.insydetradar.com", "Aprilia100!69.", "public_html")
