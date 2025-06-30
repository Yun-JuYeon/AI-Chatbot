from langgraph.graph import StateGraph, START, END
from langgraph.graph.graph import CompiledGraph

from study_memo.s_state import SState
from study_memo.s_nodes import *

'''
**Langgraph**
  > StateGraph(설계도): 상태(state), 입력(input), 출력(output), 설정(config)등을 정의.
    - from langgraph.graph import StateGraph 해서 StateGraph 내부에 들어가보면, init에 state, config, input, output을 받을 수 있음을 확인 가능.  

  > CompiledGraph(실제 동작 가능한 객체체): 정의된 그래프를 실제로 실행할 수 있는 형태로 변환하여 런타임에서 작업을 수행.    
    - 반환 타입을 CompiledGraph로 지정하면, Langgraph 그래프의 실행 준비 완료 상태를 나타냄.

  > 마지막에 sgraph = s_graph()를 하는 이유는?
    - CopmiledGraph를 한번만 하기 위해서.(초기화 패턴)
    - 그래프 컴파일은 비싸기도 하고, 매번 그래프를 호출할 때 컴파일 한다면 느림.
    - 그래프 컴파일 시 내부적으로 상태 머신을 구성하고, 그래프 경로를 최적화 함.
    -> 이 작업을 매번 반복하지 않고, 어플리케이션 시작 시 한 번만 컴파일 하고 그것을 재사용하기 위해 사용함.(컴파일 후 재사용 패턴)
'''

def s_graph() -> CompiledGraph:
    graph: StateGraph = StateGraph(state_schema=SState)

    graph.add_node("add_name", add_name)
    graph.add_node("add_age", add_age)

    graph.add_edge(START, "add_name")
    graph.add_edge("add_name", "add_age")
    graph.add_edge("add_age", END)

    return graph.compile()
    
sgraph = s_graph()



import asyncio

async def main():
    state = SState(name = "", age = 0)
    response = await sgraph.ainvoke(input=state)
    print(response)

if __name__ == "__main__":
    asyncio.run(main())
    