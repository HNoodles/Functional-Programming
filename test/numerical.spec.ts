import { list_to_array } from "../src/basic";
import { next, repeat, within_sqrt, take, relative_sqrt } from "../src/numerical"


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