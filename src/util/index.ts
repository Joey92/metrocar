type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export const reduceIdsToObject = <
  A extends readonly any[],
  R extends string | number | symbol,
  T = ArrayElement<A>
>(
  arr: A,
  idFunc: (input: T) => R
) =>
  arr.reduce((acc, element) => {
    acc[idFunc(element)] = element;
    return acc;
  }, {} as Record<R, T>);
