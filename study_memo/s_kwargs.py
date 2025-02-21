def s_kwargs(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")


#s_kwargs(name="윤주연", age=25, city="Seoul")


def greet(**kwargs):
    if "name" in kwargs:
        print(f"Hello, My name is {kwargs['name']}")
    else:
        print(f"Hi, What's your name?")


#greet(name="ㅇㅈㅇ", age=100)


def create_user(**kwargs):
    user_info = {
        "name": kwargs['name'],         # kwargs dict에서 가져올 때 []로 가져오면 값이 안들어왔을 때 오류발생
        "age": kwargs.get('age', 0)     # get으로 가져오면 기본값 지정 가능. (지정 안할 시 None)
    }
    return user_info

print(create_user(name="운즈얀"))


# 언패킹
def display_info(name, age, city):
    print(f"Name: {name}, Age: {age}, City: {city}")

data = {"name": "Eve", "age": 22, "city": "Busan"}
display_info(**data)
