import Taro from '@tarojs/taro';

export const request = async (url,data={},method="POST") => {
    const full_url = "http://now.local.com/api/" +url
    try {
        const res = await Taro.request({
            url: full_url,
            method,
            data,
        });
    if(res.data.code == -1 || res.statusCode ===401){
        return res;
    }else if (res.data.code == 1){
        const {data}= res.data;
        return data;
    }else{
        Taro.showToast({
            title:res.data.msg,
            icon:'none',
            duration:2000
        });
        throw new Error(res.data.msg);
    }
    } catch(error){
        throw error;
    }
}