import { nil, cons } from '../src/basic';

import { node } from '../src/tree';
import { reduce_tree } from '../src/tree';


const simple_tree = node(1, 
    cons(
        node(2, nil), 
        cons(
            node(3, cons(node(4, nil), nil)), 
            nil
        )
    )
);
const add = (a: number, b: number) => a + b;

test('reduce_tree', () => {
    expect(reduce_tree(add, add, 0)(simple_tree)).toBe(10);
})
