import { useMutation } from '@tanstack/react-query';
import { editStatus } from '@/services/status/statuses';
import { Status } from '@/types/status';
import { StatusComposeFormData } from '@/components/organisms/compose/types';
import { ErrorResponse } from '@/types/error';
import { AxiosError } from 'axios';

export const useEditStatus = () => {

    return useMutation<Status, AxiosError<ErrorResponse>, { id: string, formData: StatusComposeFormData }>(
        {
            mutationFn: ({ id, formData }) => editStatus(id, formData),
            mutationKey: ['editStatus'],
        }
    );
};
