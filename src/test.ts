/** テスト */
function doTest() {
  putLog(['DoTest']);

  putLog(['DoTest(done)']);
}

function test_something() {
  const test_f = (x: number) => { x * 2; };
  assertEqual(test_f(2), 4);
  assertEqual(test_f(3), 6);
  assertNotEqual(test_f(4), 7);
}

function assertEqual(eval_val: any, expect_val: any) {
  if (eval_val !== expect_val)
    throw Error(`Expected ${expect_val} : evaluate value is ${eval_val}`);
}

function assertNotEqual(eval_val: any, expect_val: any) {
  if (eval_val === expect_val)
    throw Error(`Expected !${expect_val} : evaluate value is ${eval_val}`);
}


