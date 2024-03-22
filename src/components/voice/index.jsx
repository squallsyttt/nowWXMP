import {View} from "@tarojs/components";
import "./index.scss";
import {Image} from "@nutui/nutui-react-taro";
import listenIcon from '../../assets/listen.png';
import starItemIcon from '../../assets/starItem.png';

function VoiceItem(props) {
    const {title="",like="",img="",type="voice",star = 0,onClick} = props;

    const img_host = "https://www.csck.tech/";

    return (
        <View className={"voice-item-box"} onClick={onClick}>
            <View className={"voice-item-top"}>
                {star === 1 && (
                    <img src={starItemIcon} className={"top-like"}/>
                )}
                <img className="item-img" mode="aspectFill" src={img_host+img} alt="item-img"/>
            </View>
            <View className={"voice-item-bottom"}>
                <View className={'bottom-title'}>{title}</View>
                <View className={'bottom-info'}>
                    <Image width={"24rpx"} height={"24rpx"} src={listenIcon}/>
                    {like+"人在听"}
                </View>
            </View>
        </View>
    )
}
export default VoiceItem