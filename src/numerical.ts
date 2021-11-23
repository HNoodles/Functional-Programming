import { cons, Cons, List, list_to_array, nil } from "./basic";

// 惰性cons实现，将list中的T从值转为函数，避免无限Cons立即执行导致stack爆炸
export type Lazy_Cons<T> = Cons<() => T>;
const lazy_cons = <T>(x: T, list: List<T>): Lazy_Cons<T> => cons(() => x, list);

// 惰性map实现，每次前进一步需要执行x和list得到下一步的值
export const lazy_map_list = <U, T>(list: Lazy_Cons<T>, f: (t: T) => U): Lazy_Cons<U> => 
// @ts-ignore 断言list.list是函数
    lazy_cons(f(list.x()), () => lazy_map_list(list.list(), f));


/* Newton-Raphson Square Roots */
// 单步逼近算子实现：N为需要计算平方根的值，x为上一步逼近的解
export const next = (N: number) => (x: number) => (x + N / x) / 2;

// repeat实现：无限重复执行f，得到一个[a, f a, f(f a), ...]
export const repeat = <T>(f: (t: T) => T, a: T): Lazy_Cons<T> => lazy_cons(a, () => repeat(f, f(a)));

// @ts-ignore 取一个无限Cons的前n个元素，断言list.list不为nil
export const take = <T>(n: number, list: Lazy_Cons<T>): List<T> => n == 0 ? nil : cons(list.x(), take(n - 1, list.list()));

// within实现：给定eps限制和无限Cons list，当连续两次计算结果a, b之间差的绝对值小于eps时返回b，否则继续计算
const within = (eps: number, list: Lazy_Cons<number>): number => {
    const list_next_two = take(2, list);
    const [a, b] = list_to_array(list_next_two);
    // @ts-ignore 断言list.list一定存在
    return Math.abs(a - b) <= eps ? b : within(eps, list.list());
};

// 基于within的sqrt实现
export const within_sqrt = (a0: number, eps: number, N: number): number => within(eps, repeat(next(N), a0));

// relative实现：类似within实现，通过|a - b| <= eps * |b|约束1 - eps <= |a / b| <= 1 + eps
const relative = (eps: number, list: Lazy_Cons<number>): number => {
    const list_next_two = take(2, list);
    const [a, b] = list_to_array(list_next_two);
    // @ts-ignore 断言list.list一定存在
    return Math.abs(a - b) <= eps * Math.abs(b) ? b : relative(eps, list.list());
};

// 基于relative的sqrt实现
export const relative_sqrt = (a0: number, eps: number, N: number): number => relative(eps, repeat(next(N), a0));


/* Numerical Differentiation */
// 简易的diff实现：给定函数f和位置x，以h为偏差估算导数
export const easy_diff = (f: (x: number) => number, x: number) => (h: number): number => 
    (f(x + h) - f(x)) / h;

// 减半函数
const halve = (x: number): number => x / 2;
// 基于easy_diff的求导实现，以h0为初始偏差，逐步减半，逼近函数f在x位置上的导数
export const differentiate = (h0: number, f: (x: number) => number, x: number): Lazy_Cons<number> => lazy_map_list(repeat(halve, h0), easy_diff(f, x));

// 基于within的求导逼近实现
export const within_differentiate = (eps: number, h0: number, f: (x: number) => number, x: number): number => within(eps, differentiate(h0, f, x));

// 基于误差消除的无限序列逼近，n为误差的阶数
const eliminate_error = (n: number, list: Lazy_Cons<number>): Lazy_Cons<number> => {
    const list_next_two = take(2, list);
    const [a, b] = list_to_array(list_next_two);
    // @ts-ignore 断言list.list一定存在，且为可执行的函数
    return lazy_cons((b * (2 ** n) - a) / (2 ** n - 1), () => eliminate_error(n, list.list()))
};
// 误差阶数估计
const order = (list: Lazy_Cons<number>): number => {
    const list_next_three = take(3, list);
    const [a, b, c] = list_to_array(list_next_three);
    const order = Math.round(Math.log2((a - c) / (b - c) - 1));
    // 当逼近近乎收敛时，a, b, c十分接近，会导致除0或者log(0)，此时直接返回-Infinity，表示几乎没有误差
    return isNaN(order) ? -Infinity : order;
};
// @ts-ignore 提升无限逼近序列收敛速度的函数，当order计算得到0的时候说明不需要进一步improve误差估计，当前值已经满足要求，直接执行下一个
const improve = (list: Lazy_Cons<number>): Lazy_Cons<number> => order(list) === 0 ? list.list() : eliminate_error(order(list), list);
// 提升收敛速度的基于within的求导实现
export const improved_within_differentiate = (eps: number, h0: number, f: (x: number) => number, x: number): number => within(eps, improve(differentiate(h0, f, x)));
// 叠加使用improve以快速提升收敛速度
export const highly_improved_within_differentiate = (eps: number, h0: number, f: (x: number) => number, x: number): number => within(eps, improve(improve(improve(differentiate(h0, f, x)))));

// 每两个数取一个数
const second = (list: Lazy_Cons<number>) => {
    const list_next_two = take(2, list);
    const [a, b] = list_to_array(list_next_two);
    return b;
};
// 高阶叠加使用improve
const super_order = (list: Lazy_Cons<number>) => lazy_map_list(repeat(improve, list), second);
// 利用高阶叠加的improve加速求导收敛
export const super_improved_within_differentiate = (eps: number, h0: number, f: (x: number) => number, x: number): number => within(eps, super_order(differentiate(h0, f, x)));


/* Numerical Integration */
// 简易的积分实现，衡量函数f在x = a到x = b之间与坐标轴围成的面积
export const easy_integrate = (f: (x: number) => number, a: number, b: number): number => 
    (f(a) + f(b)) * (b - a) / 2;

// 定义Pair类型为两个同类型元素组成的array
export class Pair<T> { constructor(readonly a: T, readonly b: T) { } };
// 定义函数式的Pair构造
export const pair = <T>(a: T, b: T): Pair<T> => new Pair<T>(a, b);
// 定义对数值类型Pair的相加
export const add_pair = (pair: Pair<number>): number => pair.a + pair.b;
// 定义将两个Cons拼接在一起成为Pair的zip
export const lazy_zip = <T>(first_cons: Lazy_Cons<T>, second_cons: Lazy_Cons<T>): Lazy_Cons<Pair<T>> => lazy_cons(
    pair(first_cons.x(), second_cons.x()), 
    // @ts-ignore 断言cons的list都存在，不为nil
    () => lazy_zip(first_cons.list(), second_cons.list())
);
// 取平均数函数
const mid = (a: number, b: number): number => (a + b) / 2;
// 基于easy_integrate的积分实现，对a, b之间不断切分求和无限逼近
export const integrate = (
    f: (x: number) => number, 
    a: number, b: number
): Lazy_Cons<number> => lazy_cons(
    easy_integrate(f, a, b), 
    () => lazy_map_list(lazy_zip(
        integrate(f, a, mid(a, b)), 
        integrate(f, mid(a, b), b)
    ), add_pair)
);

// 优化避免重复调用f的integrate实现
const integ_helper = (
    f: (x: number) => number, 
    a: number, b: number, 
    fa: number, fb: number
): Lazy_Cons<number> => {
    const m = mid(a, b);
    const fm = f(m);
    return lazy_cons(
        (fa + fb) * (b - a) / 2, 
        () => lazy_map_list(lazy_zip(
            integ_helper(f, a, m, fa, fm), 
            integ_helper(f, m, b, fm, fb)
        ), add_pair)
    )
};
export const efficient_integrate = (
    f: (x: number) => number, 
    a: number, b: number
): Lazy_Cons<number> => integ_helper(f, a, b, f(a), f(b));

// 基于within的积分逼近实现
export const within_integrate = (
    eps: number, 
    f: (x: number) => number, 
    a: number, b: number
): number => within(eps, efficient_integrate(f, a, b));

// 基于relative的积分逼近实现
export const relative_integrate = (
    eps: number, 
    f: (x: number) => number, 
    a: number, b: number
): number => relative(eps, efficient_integrate(f, a, b));

// 基于super的积分逼近
export const super_integrate = (
    eps: number, 
    f: (x: number) => number, 
    a: number, b: number
): number => within(eps, super_order(efficient_integrate(f, a, b)));

// 基于improve的积分逼近
export const improve_integrate = (
    eps: number, 
    f: (x: number) => number, 
    a: number, b: number
): number => within(eps, improve(efficient_integrate(f, a, b)));