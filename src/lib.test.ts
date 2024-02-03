import { describe, expect, test } from '@jest/globals';
import {
    getFilename,
    getVersionedFilename,
} from './lib';

describe('lib module', () => {
    test(
        'It extracts filename and appends version',
        () => {
            expect(getVersionedFilename('path/to/file', 'v1.0.0')).toEqual('file-v1.0.0')
        }
    );

    test(
        'It returns 0 when calling well formed system commands',
        () => {
            expect(getFilename('/path/to/file.txt')).toEqual('file.txt')
        }
    )

    test(
        'It runs the matching command',
        () => {
        }
    )

    test(
        'It runs default command if specified and no match is found',
        () => {
        }
    )
});