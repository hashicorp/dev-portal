/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import processSnippet from './process-snippet'

it('should not affect non-shell snippets', () => {
	const snippet = `package main

    import "fmt"
    
    func main() {
        ch := make(chan float64)
        ch <- 1.0e10 // magic number
        x, ok := <- ch
        defer fmt.Println("exiting now")
        go println(len("hello world!"))
        return
    }`
	expect(processSnippet(snippet)).toBe(snippet)
})

it('should copy a single line shell snippet as expected', () => {
	const snippet = `$ vault kv get kv-v1/<PATH>`
	const expected = `vault kv get kv-v1/<PATH>`
	expect(processSnippet(snippet)).toBe(expected)
})

it('should copy a single-line shell snippet with output as expected', () => {
	const snippet = `$ vault kv put kv-v1/eng/apikey/Google key=-

    AAaaBBccDDeeOTXzSMT1234BB_Z8JzG7JkSVxI
    <Ctrl+d>`
	const expected = `vault kv put kv-v1/eng/apikey/Google key=-`
	expect(processSnippet(snippet)).toBe(expected)
})

it('should copy a multi-line shell snippet as expected', () => {
	const snippet = `$ vault kv put kv-v1/dev/config/mongodb url=foo.example.com:35533 \\
    db_name=users \\
    username=admin password=passw0rd`
	const expected = `vault kv put kv-v1/dev/config/mongodb url=foo.example.com:35533 \\
    db_name=users \\
    username=admin password=passw0rd`
	expect(processSnippet(snippet)).toBe(expected)
})

it('should copy a multi-line shell snippet with quotes as expected', () => {
	const snippet = `$ boundary roles create -scope-id=$ORG_ID -name="read-only" \\
  -description="Role with read-only permission"`
	const expected = `boundary roles create -scope-id=$ORG_ID -name="read-only" \\
  -description="Role with read-only permission"`
	expect(processSnippet(snippet)).toBe(expected)
})
