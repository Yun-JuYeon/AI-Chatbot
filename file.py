import requests
import os

# =====================================
#  with open을 사용하여 파일을 읽을 때
# =====================================
"""
원래 파일을 읽거나 쓰면 무조건 마지막에 close() 호출을 해야 리소스 낭비가 없음.
python에서 제공하는 open을 사용하면 자동적으로 마지막에 close를 해줌.

파일을 읽을때는 '파일포인터'로 현재 위치를 관리함. 그래서 with문 중간이나 마지막에서 다시 처음부터 읽고 싶다면 seek(0)를 호출해서 포인터를 처음 위치로 이동한 후 다시 읽어야함.
> 파일이 열릴 때:
  - 기본적으로 파일 포인터는 파일의 시작(0번 바이트)에 위치함.
> 파일 읽기/쓰기 작업을 하면:
  - 파일 포인터가 자동으로 이동함.
  - 파일을 읽으면 읽은 바이트 수만큼 포인터가 이동함.
"""
def with_open_file():
    with open("assets/kinu_question.txt", "r", encoding="utf-8") as r:
        data = r.read()
        for d in data:
            print(d)

    # print(data)


def file_download(file_path:str, file_name:str):
    save_path = f"assets/{file_name}"
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    response = requests.get(url=file_path, stream=True)

    if response.status_code == 200:
        with open(save_path, "wb") as f:  # wb는 바이너리 쓰기 모드
            for chunk in response.iter_content(chunk_size=8192): # 8KB 단위로 다운로드
                f.write(chunk)
            print(f"✅ PDF 파일 다운로드 완료: {save_path}")
    else:
        print(f"❌ 다운로드 실패: {response.status_code}")


def get_file_download():
    pdf_file = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    txt_file = "https://www.w3.org/TR/PNG/iso_8859-1.txt"
    docx_file = "assets/김건희 도이치모터스.docx"

    file_download(pdf_file, "PDF테스트.pdf")
    file_download(txt_file, "TXT테스트.txt")
    file_download(docx_file, "DOCX테스트.docx")


if __name__=="__main__":
    # with_open_file()
    file_download()