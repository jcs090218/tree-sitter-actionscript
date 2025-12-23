import XCTest
import SwiftTreeSitter
import TreeSitterTreeSitterActionscript

final class TreeSitterTreeSitterActionscriptTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_tree_sitter_actionscript())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading TreeSitterActionscript grammar")
    }
}
