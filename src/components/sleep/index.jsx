import {View} from "@tarojs/components";
import "./index.scss";

function SleepItem(props) {
    const {title="",like="",img="",type="voice"} = props;

    const img_host = "http://now.local.com/";

    return (
        <View className={"voice-item-box"}>
            <View className={"voice-item-top"}>
                <View className={"top-like"}>

                </View>
                <img className="item-img" mode="aspectFill" src={img_host+img} alt="item-img"/>
            </View>
            <View className={"voice-item-bottom"}>
                <View className={'bottom-title'}>{title}</View>
                <View className={'bottom-info'}>
                    {like+"分钟"}
                </View>
            </View>
        </View>
    )
}
export default SleepItem