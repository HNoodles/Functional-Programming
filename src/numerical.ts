import { cons, Cons, List, list_to_array, nil } from "./basic";


const lazy_cons = <T>(x: T, list: () => List<T>) => cons(x, list);

/* Newton-Raphson Square Roots */
// 单步逼近算子实现：N为需要计算平方根的值，x为上一步逼近的解
export const next = (N: number) => (x: number) => (x + N / x) / 2;

// repeat实现：无限重复执行f，得到一个[a, f a, f(f a), ...]
export const repeat = <T>(f: (t: T) => T, a: T): Cons<T> => lazy_cons(a, () => repeat(f, f(a)));

// @ts-ignore 取一个无限Cons的前n个元素，断言list.list不为nil
export const take = <T>(n: number, list: Cons<T>): List<T> => n == 0 ? nil : cons(list.x, take(n - 1, list.list()));

// within实现：给定eps限制和无限Cons list，当连续两次计算结果a, b之间差的绝对值小于eps时返回b，否则继续计算
const within = (eps: number, list: Cons<number>): number => {
    const list_next_2 = take(2, list);
    const [a, b] = list_to_array(list_next_2);
    // @ts-ignore 断言list.list一定存在
    return Math.abs(a - b) <= eps ? b : within(eps, list.list());
};

// 基于within的sqrt实现
export const within_sqrt = (a0: number, eps: number, N: number): number => within(eps, repeat(next(N), a0));

// relative实现：类似within实现，通过|a - b| <= eps * |b|约束1 - eps <= |a / b| <= 1 + eps
const relative = (eps: number, list: Cons<number>): number => {
    const list_next_2 = take(2, list);
    const [a, b] = list_to_array(list_next_2);
    // @ts-ignore 断言list.list一定存在
    return Math.abs(a - b) <= eps * Math.abs(b) ? b : relative(eps, list.list());
};

// 基于relative的sqrt实现
export const relative_sqrt = (a0: number, eps: number, N: number): number => relative(eps, repeat(next(N), a0));


/* Numerical Differentiation */
