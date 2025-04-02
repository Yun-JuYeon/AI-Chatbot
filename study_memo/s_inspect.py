import inspect

def first_n():
    def_name = inspect.currentframe().f_code.co_name
    print(def_name)
    return def_name

def second_n():
    def_name = inspect.currentframe().f_code.co_name
    print(def_name)
    return def_name


if __name__ == "__main__":
    first_n()
    second_n()