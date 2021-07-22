import request_logic from '@/utils/request_logic';

export interface paramsType {
  skip: number;
  limit: number;
}

export async function getSDKs(params: paramsType) {
  const { skip, limit } = params;
  let url = '/esp_sdks?orderby=-1';
  if (typeof skip === 'number') url += `&skip=${skip}`;
  if (typeof limit === 'number') url += `&limit=${limit}`;
  return request_logic(url, {
    method: 'GET',
  });
}

export async function getSDKsCount() {
  let url = '/esp_sdk_count';
  return request_logic(url, {
    method: 'GET',
  });
}

export async function deleteSDK(version: string) {
  let url = '/esp_sdk_delete/' + version;
  return request_logic(url, {
    method: 'DELETE',
  });
}

export async function uploadSDK(value: any) {
  let filedata = new FormData();
  filedata.append('esp-sdk', value.upload);
  filedata.append('description', value.description);
  let url = '/esp_sdk_upload';
  return request_logic(url, {
    method: 'POST',
    requestType: 'form',
    data: filedata,
  });
}
