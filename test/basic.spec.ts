import { nil, cons, list_from_array, list_to_array } from '../src/basic';
import { sum_simple, sum, product, any_true, all_true, append } from '../src/basic';


test('from_list', () => {
    expect(list_from_array([1, 2, 3])).toStrictEqual(cons(1, cons(2, cons(3, nil))));
})

test('to_list', () => {
    expect(list_to_array(cons(1, cons(2, cons(3, nil))))).toStrictEqual([1, 2, 3]);
})

test('sum_simple', () => {
    expect(sum_simple(list_from_array([1, 2, 3]))).toBe(6);
})

test('sum', () => {
    expect(sum(list_from_array([1, 2, 3]))).toBe(6);
})

test('product', () => {
    expect(product(list_from_array([1, 2, 3]))).toBe(6);
})

test('any_true', () => {
    expect(any_true(list_from_array([true, false, false]))).toBe(true);
})

test('all_true', () => {
    expect(all_true(list_from_array([true, false, false]))).toBe(false);
})

test('append', () => {
    expect(append([1, 2], [3, 4])).toStrictEqual([1, 2, 3, 4]);
})


import { reduce, map_list } from '../src/basic';


const add = (a: number, b: number) => a + b;
const inc = (a: number) => add(a, 1);
const dec = (a: number) => add(a, -1);

test('reduce', () => {
    expect(reduce(add, 0)([1, 2, 3])).toBe(6);
})

test('map_list', () => {
    expect(map_list(list_from_array([1, 2, 3]), inc)).toStrictEqual(list_from_array([2, 3, 4]));
})
