import { it, expect, jest } from '@jest/globals';

import axios from 'axios';
import { fetchData } from '../src/api';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('api', () => {
    it('fetches successfully data from an API', async () => {
        const data = { data: { userId: 1, id: 1, title: 'mock title' } };
        mockedAxios.get.mockResolvedValue(data);

        const result = await fetchData('https://jsonplaceholder.typicode.com/todos/1');
        expect(result).toEqual(data.data);
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
});

