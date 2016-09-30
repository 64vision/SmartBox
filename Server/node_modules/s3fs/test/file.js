/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Riptide Software Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (chai, chaiAsPromised, fs, Promise, S3FS) {
    'use strict';
    var expect = chai.expect,
        through = require('through2');

    chai.use(chaiAsPromised);
    chai.config.includeStack = true;

    describe('S3FS Files', function () {
        var s3Credentials,
            bucketName,
            bucketS3fsImpl,
            s3fsImpl;

        before(function () {
            if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_KEY) {
                throw new Error('Both an AWS Access Key ID and Secret Key are required');
            }
            s3Credentials = {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_KEY,
                region: process.env.AWS_REGION
            };
            bucketName = 's3fs-file-test-bucket-' + (Math.random() + '').slice(2, 8);
            s3fsImpl = new S3FS(bucketName, s3Credentials);

            return s3fsImpl.create();
        });

        beforeEach(function () {
            bucketS3fsImpl = s3fsImpl.clone('testDir-' + (Math.random() + '').slice(2, 8));
        });

        after(function (done) {
            s3fsImpl.destroy().then(function () {
                done();
            }, function (reason) {
                if (reason.code === 'NoSuchBucket') {
                    // If the bucket doesn't exist during cleanup we don't need to consider it an issue
                    done();
                } else {
                    done(reason);
                }
            });
        });

        it('should be able to read and write a file by going up a directory in a path', function () {
            var fileText = '{ "test": "test" }';
            return bucketS3fsImpl.writeFile('test-file.json', fileText).then(function () {
                return expect(bucketS3fsImpl.readFile(bucketS3fsImpl.path + '../test-file.json')).to.eventually.satisfy(function (data) {
                    expect(data.Body.toString()).to.equal(fileText);
                    return true;
                });
            });
        });

        it('should be able to read and write a file by going out of the bucket path', function () {
            var fileText = '{ "test": "test" }';
            return bucketS3fsImpl.writeFile('../' + bucketS3fsImpl.path.slice(0, -1) + 'mock/' + 'test-file.json', fileText).then(function () {
                return expect(bucketS3fsImpl.readFile('../' + bucketS3fsImpl.path.slice(0, -1) + 'mock/' + 'test-file.json')).to.eventually.satisfy(function (data) {
                    expect(data.Body.toString()).to.equal(fileText);
                    return true;
                });
            });
        });

        it('should be able to read and write a file by going out of the bucket path when using clone', function () {
            var invalidFileText = '{ "test": "invalid" }';
            var fileText = '{ "test": "test" }';
            return Promise.all([
                bucketS3fsImpl.writeFile('one/test-file.json', invalidFileText),
                bucketS3fsImpl.writeFile('two/test-file.json', fileText)
            ]).then(function () {
                var oneS3fsImpl = bucketS3fsImpl.clone('one');
                return expect(oneS3fsImpl.readFile('../two/test-file.json')).to.eventually.satisfy(function (data) {
                    expect(data.Body.toString()).to.equal(fileText);
                    return true;
                });
            });
        });

        it('should be able to read and write a file by going up a directory', function () {
            var fileText = '{ "test": "test" }';
            return bucketS3fsImpl.writeFile('../some/dir/test-file.json', fileText).then(function () {
                return expect(bucketS3fsImpl.readFile('../some/dir/somethingInvalid/../test-file.json')).to.eventually.satisfy(function (data) {
                    expect(data.Body.toString()).to.equal(fileText);
                    return true;
                });
            });
        });

        it('should be able to write a file from a string', function () {
            return expect(bucketS3fsImpl.writeFile('test-file.json', '{ "test": "test" }')).to.eventually.be.fulfilled();
        });

        it('shouldn\'t be able to write a file with invalid options', function () {
            return expect(bucketS3fsImpl.writeFile('test-file.json', '{ "test": "test" }', 1)).to.eventually.be.rejectedWith(TypeError, 'Bad arguments');
        });

        it('should be able to write a file with only encoding from a string', function () {
            return expect(bucketS3fsImpl.writeFile('test-file.json', '{ "test": "test" }', 'utf8')).to.eventually.be.fulfilled();
        });

        it('should be able to write a file from a string with a callback', function () {
            return expect(new Promise(function (resolve, reject) {
                bucketS3fsImpl.writeFile('test.json', '{ "test": "test" }', function (err, data) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            })).to.eventually.be.fulfilled();
        });

        it('should be able to write a large file', function () {
            var promise = new Promise(function (resolve, reject) {
                fs.readFile('./test/mock/large-file.txt', function (err, largeFile) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(bucketS3fsImpl.writeFile('write-large.txt', largeFile));
                });

            });
            return expect(promise).to.eventually.be.fulfilled();
        });

        it('shouldn\'t be able to read a file with invalid options', function () {
            return expect(bucketS3fsImpl.readFile('test-file.json', 1)).to.eventually.be.rejectedWith(TypeError, 'Bad arguments');
        });

        it('should be able to write a file with utf8 encoding', function () {
            var fileText = '{ "test": "test" }';
            var options = {encoding: 'utf8'};
            return bucketS3fsImpl.writeFile('test-file.json', fileText, options).then(function () {
                return expect(bucketS3fsImpl.readFile('test-file.json', options)).to.eventually.satisfy(function (data) {
                    expect(data.Body.toString()).to.equal(fileText);
                    return true;
                });
            });
        });

        it('should be able to write a file with utf16 encoding', function () {
            var fileText = '{ "test": "test" }';
            var options = {encoding: 'utf16'};
            return bucketS3fsImpl.writeFile('test-file.json', fileText, options).then(function () {
                return expect(bucketS3fsImpl.readFile('test-file.json', options)).to.eventually.satisfy(function (data) {
                    expect(data.Body.toString()).to.equal(fileText);
                    return true;
                });
            });
        });

        it('should be able to write a large file with a callback', function () {
            var promise = new Promise(function (resolve, reject) {
                fs.readFile('./test/mock/large-file.txt', function (err, largeFile) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(new Promise(function (resolve, reject) {
                        bucketS3fsImpl.writeFile('write-large-callback.txt', largeFile, function (err, data) {
                            if (err) {
                                return reject(err);
                            }
                            resolve(data);
                        });
                    }));
                });

            });
            return expect(promise).to.eventually.be.fulfilled();
        });

        it('should be able to tell if a file exists', function () {
            return expect(bucketS3fsImpl.writeFile('test-exists.json', '{ "test": "test" }')
                    .then(function () {
                        return bucketS3fsImpl.exists('test-exists.json');
                    })
            ).to.eventually.be.fulfilled();
        });

        it('should be able to tell if a file exists with a callback', function () {
            return expect(bucketS3fsImpl.writeFile('test-exists-callback.json', '{ "test": "test" }')
                    .then(function () {
                        return new Promise(function (resolve) {
                            bucketS3fsImpl.exists('test-exists-callback.json', function (exists) {
                                resolve(exists);
                            });
                        });
                    })
            ).to.eventually.be.equal(true);
        });

        it('should be able to copy an object', function () {
            return expect(bucketS3fsImpl.writeFile('test-copy.json', '{}')
                    .then(function () {
                        return bucketS3fsImpl.copyFile('test-copy.json', 'test-copy-dos.json');
                    })
                    .then(function () {
                        return bucketS3fsImpl.exists('test-copy.json');
                    })
            ).to.eventually.equal(true);
        });

        it('should be able to copy an object when going up a directory', function () {
            return expect(bucketS3fsImpl.writeFile('testDir/test-copy.json', '{}')
                    .then(function () {
                        var testDirS3fsImpl = bucketS3fsImpl.clone('testDir');
                        return testDirS3fsImpl.copyFile('../testDir/../testDir/test-copy.json', '../testDir/../testDir/test-copy-dos.json');
                    })
                    .then(function () {
                        return bucketS3fsImpl.exists('testDir/test-copy-dos.json');
                    })
            ).to.eventually.equal(true);
        });

        it('should be able to copy an object with a callback', function () {
            return expect(bucketS3fsImpl.writeFile('test-copy-callback.json', '{}')
                    .then(function () {
                        return new Promise(function (resolve, reject) {
                            bucketS3fsImpl.copyFile('test-copy-callback.json', 'test-copy-callback-dos.json', function (err, data) {
                                if (err) {
                                    return reject(err);
                                }
                                resolve(data);
                            });
                        });
                    })
            ).to.eventually.be.fulfilled();
        });

        it('should be able to get the head of an object', function () {
            return expect(bucketS3fsImpl.writeFile('test-head.json', '{}')
                    .then(function () {
                        return bucketS3fsImpl.headObject('test-head.json');
                    })
            ).to.eventually.be.fulfilled();
        });

        it('should be able to get the head of an object when going up a directory', function () {
            return expect(bucketS3fsImpl.writeFile('testDir/test-head.json', '{}')
                    .then(function () {
                        var testDirS3fsImpl = bucketS3fsImpl.clone('testDir');
                        return testDirS3fsImpl.headObject('../testDir/test-head.json');
                    })
            ).to.eventually.be.fulfilled();
        });

        it('should be able to get the head of an object with a callback', function () {
            return expect(bucketS3fsImpl.writeFile('test-head-callback.json', '{}')
                    .then(function () {
                        return new Promise(function (resolve, reject) {
                            bucketS3fsImpl.headObject('test-head-callback.json', function (err, data) {
                                if (err) {
                                    return reject(err);
                                }
                                resolve(data);
                            });
                        });
                    })
            ).to.eventually.be.fulfilled();
        });

        it('should be able to delete a file', function () {
            return expect(bucketS3fsImpl.writeFile('test-delete.json', '{ "test": "test" }')
                    .then(function () {
                        return bucketS3fsImpl.unlink('test-delete.json');
                    })
                    .then(function () {
                        return bucketS3fsImpl.readdirp('/');
                    })
            ).to.eventually.have.lengthOf(0);
        });

        it('should be able to delete a file when going up a directory', function () {
            return expect(bucketS3fsImpl.writeFile('testDir/test-delete.json', '{ "test": "test" }')
                    .then(function () {
                        var testDirS3fsImpl = bucketS3fsImpl.clone('testDir');
                        return testDirS3fsImpl.unlink('../testDir/test-delete.json');
                    })
                    .then(function () {
                        return bucketS3fsImpl.readdirp('/');
                    })
            ).to.eventually.have.lengthOf(0);
        });

        it('should be able to delete a file with a callback', function () {
            return expect(bucketS3fsImpl.writeFile('test-delete-callback.json', '{ "test": "test" }')
                    .then(function () {
                        return new Promise(function (resolve, reject) {
                            bucketS3fsImpl.unlink('test-delete-callback.json', function (err, data) {
                                if (err) {
                                    return reject(err);
                                }
                                resolve(data);
                            });
                        });
                    })
            ).to.eventually.be.fulfilled();
        });

        it('shouldn\'t be able to write a file from an object', function () {
            return expect(bucketS3fsImpl.writeFile('test-write-object.json', {test: 'test'})).to.eventually.be.rejectedWith('Expected params.Body to be a string, Buffer, Stream, Blob, or typed array object');
        });

        it('shouldn\'t be able to write a file from an object with a callback', function () {
            return expect(new Promise(function (resolve, reject) {
                bucketS3fsImpl.writeFile('test-write-object.json', {test: 'test'}, function (err, data) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            })).to.eventually.be.rejectedWith('Expected params.Body to be a string, Buffer, Stream, Blob, or typed array object');
        });

        it('should be able to write a file from a buffer', function () {
            var promise = new Promise(function (resolve, reject) {
                fs.readFile('./test/mock/example-file.json', function (err, exampleFile) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(bucketS3fsImpl.writeFile('test-buffer.json', exampleFile));
                });

            });
            return expect(promise).to.eventually.be.fulfilled();
        });

        it('should be able to write a file from a buffer with a callback', function () {
            var promise = new Promise(function (resolve, reject) {
                fs.readFile('./test/mock/example-file.json', function (err, exampleFile) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(new Promise(function (resolve, reject) {
                        bucketS3fsImpl.writeFile('test-buffer-callback.json', exampleFile, function (err, data) {
                            if (err) {
                                return reject(err);
                            }
                            resolve(data);
                        });
                    }));
                });

            });
            return expect(promise).to.eventually.be.fulfilled();
        });

        it('should be able to write a file from a stream', function () {
            var stream = fs.createReadStream('./test/mock/example-file.json');
            return expect(bucketS3fsImpl.writeFile('test-stream.json', stream)).to.eventually.be.fulfilled();
        });

        it('should be able to write a file from a stream with a callback', function () {
            var stream = fs.createReadStream('./test/mock/example-file.json');
            return expect(new Promise(function (resolve, reject) {
                bucketS3fsImpl.writeFile('test-stream-callback.json', stream, function (err, data) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            })).to.eventually.be.fulfilled();
        });

        it('should be able to write a large file from a stream', function () {
            var stream = fs.createReadStream('./test/mock/large-file.txt');
            return expect(bucketS3fsImpl.writeFile('test-large-stream.txt', stream)).to.eventually.be.fulfilled();
        });

        it('should be able to write a large file from a stream with a callback', function () {
            var stream = fs.createReadStream('./test/mock/large-file.txt');
            return expect(new Promise(function (resolve, reject) {
                bucketS3fsImpl.writeFile('test-large-stream-callback.txt', stream, function (err, data) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            })).to.eventually.be.fulfilled();
        });

        it('should be able to pipe a file from a stream', function () {
            return expect(new Promise(function (resolve, reject) {
                var fileReadStream = fs.createReadStream('./test/mock/example-file.json'),
                    s3fsWriteStream = bucketS3fsImpl.createWriteStream('test-pipe.json'),
                    bytesRead = 0,
                    calculateBytesWritten = through(function (chunk, enc, cb) {
                        bytesRead += chunk.length;
                        this.push(chunk);
                        cb();
                    });
                s3fsWriteStream.on('finish', function () {
                    expect(s3fsWriteStream).to.have.property('bytesWritten', bytesRead);
                    resolve();
                })
                    .on('error', function (err) {
                        reject(err);
                    });
                fileReadStream.pipe(calculateBytesWritten).pipe(s3fsWriteStream);

            })).to.eventually.be.fulfilled();
        });

        it('should be able to pipe a large file from a stream', function () {
            return expect(new Promise(function (resolve, reject) {
                var fileReadStream = fs.createReadStream('./test/mock/large-file.txt'),
                    s3fsWriteStream = bucketS3fsImpl.createWriteStream('test-pipe-callback.txt'),
                    bytesRead = 0,
                    calculateBytesWritten = through(function (chunk, enc, cb) {
                        bytesRead += chunk.length;
                        this.push(chunk);
                        cb();
                    });
                s3fsWriteStream
                    .on('finish', function () {
                        expect(s3fsWriteStream).to.have.property('bytesWritten', bytesRead);
                        resolve();
                    })
                    .on('error', function (err) {
                        reject(err);
                    });

                fileReadStream.pipe(calculateBytesWritten).pipe(s3fsWriteStream);

            })).to.eventually.be.fulfilled();
        });

        it.skip('should be able to write a file from a blob', function () {
            //TODO: Get this setup
            return expect(bucketS3fsImpl.writeFile('test-blobl.json', {test: 'test'})).to.eventually.be.fulfilled();
        });

        it.skip('should be able to write a file from a blob with a callback', function () {
            //TODO: Get this setup
            return expect(new Promise(function (resolve, reject) {
                bucketS3fsImpl.writeFile('test-blob-callback.json', {test: 'test'}, function (err, data) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            })).to.eventually.be.fulfilled();
        });

        it.skip('should be able to write a file from a typed array', function () {
            //TODO: Get this setup
            return expect(bucketS3fsImpl.writeFile('test-typed.json', {test: 'test'})).to.eventually.be.fulfilled();
        });

        it.skip('should be able to write a file from a typed array with a callback', function () {
            //TODO: Get this setup
            return expect(new Promise(function (resolve, reject) {
                bucketS3fsImpl.writeFile('test-blob-callback.json', {test: 'test'}, function (err, data) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            })).to.eventually.be.fulfilled();
        });

        it('should be able to read a file as a stream', function () {
            return expect(bucketS3fsImpl.writeFile('test-read-stream.json', '{ "test": "test" }')
                    .then(function () {
                        return new Promise(function (resolve, reject) {
                            var data = '';
                            bucketS3fsImpl.createReadStream('test-read-stream.json')
                                .on('data', function (chunk) {
                                    data += chunk;
                                })
                                .on('end', function () {
                                    expect(data).to.be.equal('{ "test": "test" }');
                                    resolve();
                                })
                                .on('error', function (err) {
                                    reject(err);
                                });
                        });
                    })
            ).to.eventually.be.fulfilled();
        });

        it('should be able to read a file with a callback', function () {
            var contents = '{ "test": "test" }';
            return expect(bucketS3fsImpl.writeFile('test-read-file-cb.json', contents)
                    .then(function () {
                        return new Promise(function (resolve, reject) {
                            bucketS3fsImpl.readFile('test-read-file-cb.json', function (err, data) {
                                if (err) {
                                    return reject(err);
                                }

                                resolve(data);
                            });
                        });
                    })
            ).to.eventually.be.instanceOf(Buffer).and.to.satisfy(function (data) {
                    expect(data.toString()).to.equal(contents);
                    return true;
                });
        });

        it('should be able to read a file with only encoding and a callback', function () {
            var contents = '{ "test": "test" }';
            return expect(bucketS3fsImpl.writeFile('test-read-file-encoding-cb.json', contents)
                    .then(function () {
                        return new Promise(function (resolve, reject) {
                            bucketS3fsImpl.readFile('test-read-file-encoding-cb.json', 'utf8', function (err, data) {
                                if (err) {
                                    return reject(err);
                                }

                                resolve(data);
                            });
                        });
                    })
            ).to.eventually.be.a('string').and.equal(contents);
        });

        it('should be able to read a file with encoding in options and a callback', function () {
            var contents = '{ "test": "test" }';
            return expect(bucketS3fsImpl.writeFile('test-read-file-encoding-cb.json', contents)
                    .then(function () {
                        return new Promise(function (resolve, reject) {
                            bucketS3fsImpl.readFile('test-read-file-encoding-cb.json', {encoding: 'utf8'}, function (err, data) {
                                if (err) {
                                    return reject(err);
                                }

                                resolve(data);
                            });
                        });
                    })
            ).to.eventually.be.a('string').and.equal(contents);
        });

        it('should be able to retrieve the stats of a file - stat(2)', function () {
            return expect(bucketS3fsImpl.writeFile('test-stat.json', '{ "test": "test" }')
                    .then(function () {
                        return bucketS3fsImpl.stat('test-stat.json');
                    })
            ).to.eventually.satisfy(function (stats) {
                    expect(stats.isFile()).to.be.true();
                    return true;
                });
        });

        it('should be able to retrieve the stats of a file with a callback - stat(2)', function () {
            return expect(bucketS3fsImpl.writeFile('test-stat-callback.json', '{ "test": "test" }')
                    .then(function () {
                        return new Promise(function (resolve, reject) {
                            bucketS3fsImpl.stat('test-stat-callback.json', function (err, data) {
                                if (err) {
                                    return reject(err);
                                }
                                resolve(data);
                            });
                        });
                    })
            ).to.eventually.satisfy(function (stats) {
                    expect(stats.isFile()).to.be.true();
                    return true;
                });
        });

        it('shouldn\'t be able to retrieve the stats of a file that doesn\'t exist - stat(2)', function () {
            return expect(bucketS3fsImpl.stat('test-file-no-exist.json')).to.eventually.be.rejectedWith(Error, 'NotFound');
        });

        it('shouldn\'t be able to retrieve the stats of a file that doesn\'t exist with a callback - stat(2)', function () {
            return expect(new Promise(function (resolve, reject) {
                bucketS3fsImpl.stat('test-file-no-exist.json', function (err, data) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            })).to.eventually.be.rejectedWith(Error, 'NotFound');
        });

        it('should be able to retrieve the stats of a file - lstat(2)', function () {
            return expect(bucketS3fsImpl.writeFile('test-lstat.json', '{ "test": "test" }')
                    .then(function () {
                        return bucketS3fsImpl.lstat('test-lstat.json');
                    })
            ).to.eventually.satisfy(function (stats) {
                    expect(stats.isFile()).to.be.true();
                    return true;
                });
        });

        it('should be able to retrieve the stats of a file with a callback - lstat(2)', function () {
            return expect(bucketS3fsImpl.writeFile('test-lstat-callback.json', '{ "test": "test" }')
                    .then(function () {
                        return new Promise(function (resolve, reject) {
                            bucketS3fsImpl.lstat('test-lstat-callback.json', function (err, data) {
                                if (err) {
                                    return reject(err);
                                }
                                resolve(data);
                            });
                        });
                    })
            ).to.eventually.satisfy(function (stats) {
                    expect(stats.isFile()).to.be.true();
                    return true;
                });
        });

    });
}(require('chai'), require('chai-as-promised'), require('fs'), require('bluebird'), require('../')));