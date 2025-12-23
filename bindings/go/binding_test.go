package tree_sitter_tree_sitter_actionscript_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_tree_sitter_actionscript "github.com/jcs090218/tree-sitter-actionscript/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_tree_sitter_actionscript.Language())
	if language == nil {
		t.Errorf("Error loading TreeSitterActionscript grammar")
	}
}
