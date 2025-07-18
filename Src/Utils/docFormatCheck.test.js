import { verifyDoc } from './docFormatCheck'; // replace with your actual file path
import { showError } from './helper';

//mock showError fn
jest.mock('./helper', () => ({
    showError: jest.fn(),
}));
//mock a variable which contains size and mime represents doc's size and type
const docMock = {
    size: 2097152, // 2MB in bytes
    type: 'image/png',
};

beforeEach(() => {
    showError.mockClear();
});
describe('unit test for verifyDoc', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    //testcases:
    // if filesize>20Mb 

    test('test1.should return invalid when file size exceeds 20MB', async () => {
        const largeDoc = { ...docMock, size: 22 * 1024 * 1024 }; // filesize:22mb,format:'image/png'
        const result = await verifyDoc([largeDoc], 'fileType');
        expect(result).toEqual({ isValid: false, message: '' });
        expect(showError).toHaveBeenCalledWith('file more than 20MB is not allowed');
    });
    //if fileformat other than the allowedformat

    test('test2.should return invalid for unsupported file types', async () => {
        const unsupportedDoc = { ...docMock, type: 'image/bmp' };//filesize:2mb,format:'image/bmp'
        const result = await verifyDoc([unsupportedDoc], 'fileType');
        expect(result).toEqual({ isValid: false, message: '' });
        expect(showError).toHaveBeenCalledWith('Unsupported file type. Please upload a file in PNG, JPEG, PDF, DOC, or Excel format.');
    });


    test('test2.should return invalid for unsupported file types', async () => {
        const unsupportedDoc = { ...docMock, type: 'image/svg+xml' };//filesize:2mb,format:'image/svg+xml'
        const result = await verifyDoc([unsupportedDoc], 'fileType');
        expect(result).toEqual({ isValid: false, message: '' });
        expect(showError).toHaveBeenCalledWith('Unsupported file type. Please upload a file in PNG, JPEG, PDF, DOC, or Excel format.');
    });


    // if file format comes under allowed formats and filesize<20mb

    test('test3.should return valid for allowed file type and size', async () => {
        const validDoc = { ...docMock, size: 2 * 1024 * 1024, type: 'application/pdf' }; // filesize:2MB,format: pdf file
        const result = await verifyDoc([validDoc], 'fileType');
        expect(result).toEqual({ isValid: true, message: [validDoc] });
        expect(showError).not.toHaveBeenCalled();
    });
    test('test3.should return valid for allowed file type and size', async () => {
        const validDoc = { ...docMock, size: 2 * 1024 * 1024, type: 'application/msword', }; // filesize:2MB, format:'application/msword',
        const result = await verifyDoc([validDoc], 'fileType');
        expect(result).toEqual({ isValid: true, message: [validDoc] });
        expect(showError).not.toHaveBeenCalled();
    });

    //if fileformat other than the allowedformat and file size greater than 20mb
    test('test4.should return invalid when file size exceeds 20MB', async () => {
        const largeDoc = { ...docMock, size: 22 * 1024 * 1024 }; // filesize:22mb,format:'image/png'
        const result = await verifyDoc([largeDoc], 'fileType');
        expect(result).toEqual({ isValid: false, message: '' });
        expect(showError).toHaveBeenCalledWith('file more than 20MB is not allowed');
    });
});
