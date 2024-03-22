import {View} from "@tarojs/components";
import "./index.scss";
import starItemIcon from '../../assets/starItem.png';


function SleepItem(props) {
    const {title="",like="",img="",type="voice",star = 0,onClick} = props;

    const img_host = "https://www.csck.tech/";

    return (
        <View className={"sleep-item-box"} onClick={onClick}>
            <View className={"sleep-item-top"}>
                {star === 1 && (
                    <img src={starItemIcon} className={"top-like"}/>
                )}
                <img className="item-img" mode="aspectFill" src={img_host+img} alt="item-img"/>
            </View>
            <View className={"sleep-item-bottom"}>
                <View className={'bottom-title'}>{title}</View>
                <View className={'bottom-info'}>
                    {like+"分钟"}
                </View>
            </View>
        </View>
    )
}
export default SleepItem