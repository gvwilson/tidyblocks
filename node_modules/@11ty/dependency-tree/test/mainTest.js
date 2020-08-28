import test from "ava";
import DependencyTree from "../main.js";

test("Nonexistent", t => {
	t.throws(() => {
		DependencyTree("./test/stubs/thisdoesnotexist.js");
	});
});

test("Allow not Found", t => {
	DependencyTree("./test/stubs/thisdoesnotexist.js", { allowNotFound: true });
	t.true(true);
});

test("Not require()’d before calling", t => {
	DependencyTree("./test/stubs/parent/parent.js");
	t.true(true);
});

test("simple.js", t => {
	t.deepEqual(DependencyTree("./test/stubs/simple.js"), ["./test/stubs/simple2.js"]);
});

test("parent.js", t => {
	t.deepEqual(DependencyTree("./test/stubs/parent/parent.js").sort(), [
		"./test/stubs/parent/child1.js",
		"./test/stubs/parent/child2.js",
		"./test/stubs/parent/grandchild.js",
		"./test/stubs/parent/greatgrandchild.js"
	]);

	t.deepEqual(DependencyTree("./test/stubs/parent/child1.js").sort(), [
		"./test/stubs/parent/grandchild.js",
		"./test/stubs/parent/greatgrandchild.js"
	]);

	t.deepEqual(DependencyTree("./test/stubs/parent/child2.js").sort(), [
		"./test/stubs/parent/grandchild.js",
		"./test/stubs/parent/greatgrandchild.js"
	]);

	t.deepEqual(DependencyTree("./test/stubs/parent/grandchild.js"), [
		"./test/stubs/parent/greatgrandchild.js"
	]);

	t.deepEqual(DependencyTree("./test/stubs/parent/greatgrandchild.js"), []);
});

test("circular", t => {
	t.deepEqual(DependencyTree("./test/stubs/circular/circle-a.js").sort(), [
		"./test/stubs/circular/circle-b.js",
		"./test/stubs/circular/circle-c.js"]);
});

test("another circular", t => {
	t.deepEqual(DependencyTree("./test/stubs/circular2/circle-a.js").sort(), [
		"./test/stubs/circular2/circle-b.js",
		"./test/stubs/circular2/circle-c.js"
	]);
});

test("dot dot (dependency is up a directory)", t => {
	t.deepEqual(DependencyTree("./test/stubs/dotdot/dotdot.js").sort(), [
		"./test/stubs/simple2.js"
	]);
});