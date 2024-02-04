import { describe, expect, test } from '@jest/globals';
import {
    getPaths,
    getFilename,
    getVersionedFilename,
    toBool
} from './lib';

describe('lib module', () => {
    test(
        'It runs the matching command',
        () => {
            expect(getPaths(`
            path/to/foo
            path/to/bar
            path/to/baz
            `)).toEqual([
                'path/to/foo',
                'path/to/bar',
                'path/to/baz'
            ])
            expect(getPaths(`path/to/foo, path/to/bar, path/to/baz`)).toEqual([
                'path/to/foo',
                'path/to/bar',
                'path/to/baz'
            ])
        }
    )

    test(
        'It extracts filenames from filepaths',
        () => {
            expect(getFilename('/path/to/file')).toEqual('file')
            expect(getFilename('/path/to/.file')).toEqual('.file')
            expect(getFilename('/path/to/some_file')).toEqual('some_file')
            expect(getFilename('/path/to/some-file')).toEqual('some-file')
            expect(getFilename('/path/to/file.txt')).toEqual('file.txt')
            expect(getFilename('/path/to/FILE.txt')).toEqual('FILE.txt')
        }
    )

    test(
        'It appends versions to filenames',
        () => {
            expect(getVersionedFilename('path/to/file', 'v1.0.0')).toEqual('file_v1.0.0')
            expect(getVersionedFilename('path/to/.file', 'v1.0.0')).toEqual('.file_v1.0.0')
            expect(getVersionedFilename('path/to/some_file', 'v1.0.0')).toEqual('some_file_v1.0.0')
            expect(getVersionedFilename('path/to/some-file', 'v1.0.0')).toEqual('some-file_v1.0.0')
            expect(getVersionedFilename('path/to/file.ext', 'v1.0.0')).toEqual('file_v1.0.0.ext')
            expect(getVersionedFilename('path/to/FILE.ext', 'v1.0.0')).toEqual('FILE_v1.0.0.ext')
        }
    );

    test(
        'It converts boolean boolean string repr to boolean type',
        () => {
            expect(toBool('false')).toBe(false)
            expect(toBool('true')).toBe(true)
        }
    )
});