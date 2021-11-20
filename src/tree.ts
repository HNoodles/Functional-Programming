import { Nil, Cons, List, nil, cons, list_from_array, list_to_array } from "./basic";

/* Data Structures */
export class Tree<T> { constructor(readonly node:T, readonly list: List<Tree<T>>) { } };

export const node = <T>(node: T, list: List<Tree<T>>) => new Tree<T>(node, list);


/* Operational Functions */
// export const tree_from_array = <T>(list: (T|Nil)[]): Tree<T> => node(list[0], tree_from_array_helper(list, 0));
// const tree_from_array_helper = <T>(list: (T|Nil)[], index: number): List<Tree<T>> => list[0] instanceof Nil ? nil : cons(tree_from_array(sub_tree_array_of(list, index * 2 + 1)), tree_from_array_helper(list, index * 2 + 2));
// // 对一个array取出index对应的元素为root的子树
// // 其中如果对应元素已经是nil了，或者子元素下标越界，就返回[nil]，否则返回[对应元素，...左子树, ...右子树]
// const sub_tree_array_of = <T>(list: (T|Nil)[], index: number): (T|Nil)[] => {
//     const sub_tree_array = [list[index]];
//     const left_child = (index: number) => index * 2 + 1;
//     const right_child = (index: number) => index * 2 + 2;
//     while ()
// };
//     (list[index] instanceof Nil || index * 2 + 1 >= list.length || index * 2 + 2 >= list.length) ? 
//         [nil] : [list[index], ...sub_tree_array_of(list, index * 2 + 1), ...sub_tree_array_of(list, index * 2 + 2)];

// const left_child_of = <T>(list: (T|Nil)[], index: number): T|Nil => index * 2 + 1 < list.length ? list[index * 2 + 1] : nil;
// const right_child_of = <T>(list: (T|Nil)[], index: number): T|Nil => index * 2 + 1 < list.length ? list[index * 2 + 2] : nil;

// 对Tree类型的reduce实现
// reduce_tree直接对Tree结构操作，用f处理当前label和子树list结果，其中子树list结果由reduce_tree_helper得到
export const reduce_tree = <U, T>(
    f: (label: U, accum: T) => T, 
    g: (t: T, accum: T) => T,
    base: T,
) => (list: Tree<U>): T => f(list.node, reduce_tree_helper(f, g, base)(list.list));
// reduce_tree_helper对子树List结构操作，用reduce_tree处理list的x（即第一个子树），用reduce_tree_helper处理list的list（即后续子树list），再用g处理上述两个的返回结果；
// 当处理到list的边界（即Nil）时，返回base
const reduce_tree_helper = <U, T>(
    f: (label: U, accum: T) => T, 
    g: (t: T, accum: T) => T,
    base: T,
) => (list: List<Tree<U>>): T => list instanceof Nil ? base : g(reduce_tree(f, g, base)(list.x), reduce_tree_helper(f, g, base)(list.list));

