/* Data Structures */
export class Nil { constructor() { } }; // 空类，边界值
export const nil = new Nil(); // 空类实例

export class Cons<T> { constructor(readonly x: T, readonly list: List<T>) { } }; // Cons类，基础block，包含当前值和子Cons
export type List<T> = Nil | Cons<T>; // List类，由Cons和Nil组成的递归结构，以Cons为内容，Nil为边界

export const cons = <T>(x: T, y: List<T>) => new Cons(x, y); // 封装Cons的构造为函数操作符cons


/* Operational Functions */
// 直观的sum，对list中的元素为nil的加0，否则返回递归求和的结果
export const sum_simple = (list: List<number>): number => list instanceof Nil ? 0 : list.x + sum_simple(list.list);

// 对普通list数组的reduce实现
export const reduce = <U, T>(
    step: (i: T, accum: U) => U, 
    base: U
): (list: T[]) => U => list => {
    let accum = base;
    for (let i of list) {
        accum = step(i, accum);
    }
    return accum;
};

// 对普通list数组的逆序reduce实现
export const reduce_right = <U, T>(
    step: (i: T, accum: U) => U, 
    base: U
): (list: T[]) => U => list => {
    let accum = base;
    for (let i = list.length - 1; i >= 0; i--) {
        accum = step(list[i], accum);
    }
    return accum;
};

// 对List的reduce实现，基于List本身的递归结构，迭代执行step直至遇到Nil后返回base
export const reduce_list = <U, T>(
    step: (i: T, accum: U) => U, 
    base: U
): (list: List<T>) => U => list => list instanceof Nil ? base : step(list.x, reduce_list(step, base)(list.list));

// 基于逆序reduce实现的普通array到List的转换，本质是以nil为始，对arr中每个元素使用cons
export const list_from_array = reduce_right(cons, nil)
// 基于reduce_list实现的List到普通array的转换，即递归地将Cons中的x拼接到accum头部
// @ts-ignore x的类型与array的类型是否匹配不确定
export const list_to_array = reduce_list((x, accum) => [x, ...accum], []);

// 求和，求积，逻辑或，逻辑与
const add = (x: number, y: number): number => x + y;
export const sum = reduce_list(add, 0);

const multiply = (x: number, y: number): number => x * y;
export const product = reduce_list(multiply, 1);

const logical_or = (x: boolean, y: boolean): boolean => x || y;
export const any_true = reduce_list(logical_or, false);

const logical_and = (x: boolean, y: boolean): boolean => x && y;
export const all_true = reduce_list(logical_and, true);

// 基于Cons实现append，与原文有差异：原文只是示意，因此直接把cons 1 (cons 2 [3, 4])视作等同于[1, 2, 3, 4]
// 此处先把b转为List，因此最终得到的结果也是List，需要经过转换得到array
// 这里用逆序reduce是因为这里本质上是在把a: arr转换成List，转换这一步本就是要求倒序的，可以参考list_from_array
export const append = <T>(a: T[], b: T[]): T[] => list_to_array(reduce_right(cons, list_from_array(b))(a));

// 类functor的对List的map操作实现，给定f: t -> u和Ft，需要得到Fu
// 原文通过reduce + compose(cons, f)实现，这里没有成功
export const map_list = <U, T>(list: List<T>, f: (t: T) => U): List<U> => 
    list instanceof Nil ? nil : cons(f(list.x), map_list(list.list, f));


// TODO: 整理用不到的generic高阶函数
export const map = <A, B>(f: (a: A) => B) => reduce((a: A, b: B[]) => [...b, f(a)], []);

export const compose = <A, B, C>(
    f: (v: B) => C, 
    g: (v: A) => B,
): (v: A) => C => v => f(g(v));

const identity = <T>(v: T) => v;
// @ts-ignore, for the type of parameter is undetermined
export const composeAll = reduce(compose, identity);
