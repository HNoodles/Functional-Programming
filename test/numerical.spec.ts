import { compose, list_to_array, reduce } from "../src/basic";
import { next, repeat, within_sqrt, take, relative_sqrt, easy_diff, differentiate, within_differentiate, improved_within_differentiate, highly_improved_within_differentiate, super_improved_within_differentiate, easy_integrate, add_pair, pair, integrate, efficient_integrate, within_integrate, relative_integrate, improve_integrate, super_integrate } from "../src/numerical";


/* Newton-Raphson Square Roots */
test('next', () => {
    expect((next(4)(1))).toBe((1 + 4 / 1) / 2);
})

test('repeat', () => {
    expect(list_to_array(take(3, repeat(next(4), 1)))).toStrictEqual([1, 2.5, (2.5 + 4 / 2.5) / 2]);
})

test('within_sqrt', () => {
    expect(within_sqrt(1, 0.001, 4)).toBeCloseTo(2);
})

test('relative_sqrt', () => {
    expect(relative_sqrt(1, 0.001, 4)).toBeCloseTo(2);
})


/* Numerical Differentiation */
const f = (x: number): number => 2 * x;

test('easy_diff', () => {
    expect(easy_diff(f, 1)(0.1)).toBeCloseTo(2);
})

test('differentiate', () => {
    const result = list_to_array(take(2, differentiate(0.1, f, 1)));
    // 没有对list的toBeCloseTo，所以转成循环判断每个结果
    for (let est of result) {
        expect(est).toBeCloseTo(2);
    }
})

test('within_differentiate', () => {
    expect(within_differentiate(0.001, 0.1, f, 1)).toBeCloseTo(2);
})

test('improved_within_differentiate', () => {
    expect(improved_within_differentiate(0.001, 0.1, f, 1)).toBeCloseTo(2);
})

test('highly_improved_within_differentiate', () => {
    expect(highly_improved_within_differentiate(0.001, 0.1, f, 1)).toBeCloseTo(2);
})

test('super_improved_within_differentiate', () => {
    expect(super_improved_within_differentiate(0.001, 0.1, f, 1)).toBeCloseTo(2);
})


/* Numerical Integration */
test('easy_integrate', () => {
    expect(easy_integrate(f, 0, 1)).toBe(1);
})

test('add_pair', () => {
    expect(add_pair(pair(1, 2))).toBe(3);
})

test('integrate', () => {
    const result = list_to_array(take(2, integrate(f, 0, 1)));
    for (let est of result) {
        expect(est).toBeCloseTo(1);
    }
})

test('efficient_integrate', () => {
    const result = list_to_array(take(2, efficient_integrate(f, 0, 1)));
    for (let est of result) {
        expect(est).toBeCloseTo(1);
    }
})

test('within_integrate', () => {
    expect(within_integrate(0.001, f, 0, 1)).toBeCloseTo(1);
})

test('relative_integrate', () => {
    expect(relative_integrate(0.001, f, 0, 1)).toBeCloseTo(1);
})

// test('super_integrate', () => {
//     expect(super_integrate(0.001, f, 0, 1)).toBeCloseTo(1);
// })

// test('improve_integrate', () => {
//     expect(improve_integrate(0.001, f, 0, 1)).toBeCloseTo(1);
// })