import React, {Component} from 'react';
import {getDevices, getRtmp, changeCameraNames, changeCamera, getCameras, getRtmpOne} from '../util/APIUtils';
import {Button, Select, Row, Col, Divider, Spin, Alert, Input, Modal, notification} from 'antd';
import {POLL_LIST_SIZE} from '../constants';
import {withRouter} from 'react-router-dom';
import './PollList.css';
import "./video-react.css";
import VideoPlayer from './VideoPlayer';  //先引入子组件
import {getJsApiSingnature} from '../util/hmac'
import * as dd from "dingtalk-jsapi"; // 钉钉JSAPI


const {Option} = Select;

class PollList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newName: '',
            visible: false,
            deviceData: [],
            cameraList: [],
            cameraData: [],
            videoUrl: [],
            isLoading: false,
            value: 362425040027868,
            cameraValue: '',
            loading: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.cameraValChange = this.cameraValChange.bind(this);
        this.changeName = this.changeName.bind(this)
        this.changeDefaultValue = this.changeDefaultValue.bind(this)
        console.log(process)

    }

    //加载
    componentDidMount() {
        getDevices().then(res => {
            this.setState({
                deviceData: res.content,
                cameraValue:1
            })
            return res
        }).then(res => {
            this.handleChange(this.state.value)
        })
    }

//设备更改
    handleChange(value) {
        this.setState({
            isLoading: true
        })
        // getRtmp(value).then(res => {
        //     this.setState({
        //         cameraData: res,
        //         isLoading: false,
        //         value: value
        //     })
        // }).catch(e => {
        //     this.setState({
        //         isLoading: false
        //     })
        // })
        getCameras(value).then(res => {
            this.setState({
                cameraList: res,
                isLoading: false,
                value: value
            })
            this.cameraValChange(this.state.cameraValue)
        }).catch(e => {
            this.setState({
                isLoading: false
            })
        })
    }

//摄像头切换
    cameraValChange(value) {
        this.setState({
            cameraValue: value,
            isLoading: true,
            cameraData: this.state.cameraList.find(item => {
                return item.id.cameraId == value
            })
        })
        getRtmpOne(this.state.value, value).then(res => {
            this.setState({
                isLoading: false,
                videoUrl: res.data
            })
        }).catch(e => {
            this.setState({
                isLoading: false
            })
        })
    }

//更改摄像头名字
    changeName(value) {
        console.log(value)
        this.setState({
            // changeData: this.state.cameraData[value._targetInst.key],
            newName: this.state.cameraData.name
        })

        this.showModal()
    }

    componentDidUpdate(nextProps) {
    }


//弹出框展示
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
//弹出框确定
    handleOk = e => {
        this.setState({
            loading: true,
        });
        var obj = [{id: this.state.cameraValue, name: this.state.newName, sn: this.state.value.toString()}]
        changeCameraNames(obj).then(res => {
            notification.success({
                message: '通知',
                description: "修改成功.",
            });
            window.location.reload()
            this.setState({
                visible: false,
                loading: false,
            });
        }).catch(e => {
            notification.error({
                message: '通知',
                description: "修改失败.",
            });
            this.setState({
                visible: false,
                loading: false,
            });
        })

    };
//弹出框取消
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    //更改input值
    changeDefaultValue = e => {
        var o = {}
        o[e.target.name] = e.target.value
        this.setState(o)
    }

    //viceo配置
    videoJSfun(url) {
        // const obj = {
        //     width: 110,
        //     height: 180
        // }
        // const flag = !/windows phone|iphone|android/ig.test(window.navigator.userAgent)
        return {
            language: 'zh-CN',
            controls: true,  //控制条true
            preload: 'auto',  //自动加载
            errorDisplay: true,  //错误展示true
            // width: obj.width,  //宽
            // height: obj.height,  //高
            fluid: true,  //跟随外层容器变化大小，跟随的是外层宽度
            // controlBar: false,  // 设为false不渲染控制条DOM元素，只设置controls为false虽然不展示，但还是存在
            // textTrackDisplay: false,  // 不渲染字幕相关DOM
            userActions: {
                hotkeys: true  //是否支持热键
            },
            sources: [
                {
                    src: url,
                }
            ]
        }
    }


    render() {
        return (
            <div className="pollHeader">
                <h3>
                    <div className="poll-text">
                        <span>设备选择</span>
                        <Select className="poll-select" style={{width: 150}} id="selectPoll" value={this.state.value}
                                onChange={this.handleChange}
                                placeholder={'请选择设备'}>
                            {this.state.deviceData.map(item => (
                                <Option key={item.sn} value={item.sn}>{item.sn}</Option>
                            ))}
                        </Select>
                    </div>

                    <div className="poll-text">
                        <span>通道选择</span>
                        <Select className="poll-select" style={{width: 150}} id="selectPoll"
                                value={this.state.cameraValue}
                                onChange={this.cameraValChange}
                                placeholder={'请选择通道'}>
                            {this.state.cameraList.map(item => (
                                <Option key={item.id.cameraId} value={item.id.cameraId}>{item.name}</Option>
                            ))}
                        </Select>
                    </div>


                </h3>
                <Divider/>
                <Modal
                    title="修改摄像头名称"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="取消" onClick={this.handleCancel}>
                            取消
                        </Button>,
                        <Button key="确定" type="primary" loading={this.state.loading} onClick={this.handleOk}>
                            确定
                        </Button>,
                    ]}
                >
                    <Input defaultValue={this.state.cameraData.name} value={this.state.newName} name="newName"
                           onChange={this.changeDefaultValue}/>
                </Modal>

                {this.state.isLoading ? (<Spin tip="Loading...">
                </Spin>) : <Row>
                    {this.state.videoUrl.map((item, index) => {
                        return (
                            <Col className="poll-Col" span={24} key={index}>
                                <span className="changeBtn1">{this.state.cameraData.name}</span>
                                <VideoPlayer {...this.videoJSfun(item.hls ? item.hlsHd : '')} />
                                <span className="changeBtn0">
                                    <span className="changeBtn" key={index} onClick={this.changeName}>修改名称</span>
           </span>

                            </Col>

                        );
                    })
                    }

                </Row>}

            </div>
        );
    }
}

export default withRouter(PollList);
//钉钉
// dd.ready(function() {
//     alert(1)
//     dd.biz.util.openLink({
//         url:'https://www.baidu.com/',//要打开链接的地址
//         onSuccess : function(result) {
//             /**/
//         },
//         onFail : function(err) {}
//     })
// })

// var time = (new Date()).getTime()
// var test = 'test'
// console.log(getJsApiSingnature('SkhFZth9jleowXq1nAcWrEWbzjR8IiF0rYOapbHwT2ra2lCZz8lo0dIXYmL9MeWAJrh0WjgfnxWIuizNrsCptP', test, time, '222.190.141.234'))
// getprom();
// dd.config({
//     agentId: 346691413,
//     corpId: 'ding455a692fe18bb59735c2f4657eb6378f', //必填，企业ID
//     timeStamp: time, // 必填，生成签名的时间戳
//     nonceStr: test, // 必填，生成签名的随机串
//     signature: getJsApiSingnature('SkhFZth9jleowXq1nAcWrEWbzjR8IiF0rYOapbHwT2ra2lCZz8lo0dIXYmL9MeWAJrh0WjgfnxWIuizNrsCptP'), // 必填，签名
//     jsApiList: [
//         'biz.user.get',
//         'device.geolocation.get',
//         'biz.util.uploadImage'
//     ] // 必填，需要使用的jsapi列表，注意：不要带dd。
// })
// console.log(dd)
// dd.ready(() => {
//     dd.device.geolocation.get({
//         targetAccuracy: 200,
//         coordinate: 1,
//         withReGeocode: false,
//         useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false,
//         onSuccess: result => {
//
//             console.log(result,111)
//             alert("success: " + JSON.stringify(result))
//         },
//         onFail: err => {
//             console.log(err,111)
//             alert("error: " + JSON.stringify(err))
//         }
//     });
// })
