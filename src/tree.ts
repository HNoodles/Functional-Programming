import { Nil, Cons, List, nil, cons, list_from_array, list_to_array } from "./basic";

/* Data Structures */
export class Tree<T> { constructor(readonly node:T, readonly list: List<Tree<T>>) { } };

export const node = <T>(node: T, list: List<Tree<T>>) => new Tree<T>(node, list);


/* Operational Functions */
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

