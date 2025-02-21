def s_kwargs(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")


s_kwargs(name="윤주연", age=25, city="Seoul")


def greet(**kwargs):
    if "name" in kwargs:
        print(f"Hello, My name is {kwargs['name']}")
    else:
        print(f"Hi, What's your name?")


greet(name="ㅇㅈㅇ", age=100)