import inspect


def first_n():
    def_name = inspect.currentframe().f_code.co_name
    print(def_name)
    return def_name


def second_n():
    # 현재 함수 이름 뽑아오기
    def_name = inspect.currentframe().f_code.co_name
    print(def_name)
    return def_name


def get_members_n():
    """
    inspect.getmembers(object, predicate)
    : 특정 객체(object)에서 원하는 유형(predicate)의 멤버를 가져오는 함수.
      반환값: (이름, 객체) 쌍들의 리스트.
      inpect.isfunction 이면 함수만 가져옴. (predicate 안적으면 전체)

    inspect.getmodule(inspect.currentframe())
    : 현재 실행 중인 프레임이 속한 모듈을 가져옴.
      즉, 현재 실행 중인 파일(모듈)을 가리킴.

    """
    n = inspect.getmembers(
        inspect.getmodule(inspect.currentframe()), inspect.isfunction
    )
    print(n)
    return n


if __name__ == "__main__":
    first_n()
    second_n()
    get_members_n()
