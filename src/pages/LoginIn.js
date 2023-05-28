/* eslint-disable */
import { Row, Col, Button, Checkbox, Form, Input, Card, Modal } from "antd"
import logo from "../assets/images/favicon.png"
import { useState } from "react";
import { loginAPI } from "../api";
import { useHistory } from "react-router-dom";
import { isMobile } from "react-device-detect";

export default function Login(props) {
    const history = useHistory()

    const { loginAs, setloginAs, open, setopen, user, setuser } = props
    function redirect() {
        try {
            if (user !== null && loginAs === "Admin") { return "/class-schedule" }
            else if (user !== null && loginAs === "Teacher") { return "/my-class" }
            else if (user !== null && loginAs === "Student") { return "/my-schedule" }
            else { return "/" }
        } catch (err) {
            console.log(err.message)
            return location.pathname
        }
    }
    const onFinish = async (values) => {
        console.log('Success:', values);
        delete values.remember
        console.log(values)
        let col = "user"
        if (loginAs !== "") {
            if (loginAs === "Admin") {
                col = "users"
            } else {
                col = `${loginAs.toLowerCase()}s`
            }
        }
        console.log(col)
        await loginAPI(col, values.username, values.password)
            .then(res => {
                const data = res.data
                console.log(data)
                if (data.login) {
                    setuser(data.user)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    localStorage.setItem("loginAs", loginAs)
                    //change depending on loginAs
                    console.log(redirect(user, loginAs))
                    history.push(redirect(user, loginAs))
                }
                alert(data.msg)
            }).catch(err => {
                console.log(err.message)
                alert("Invalid username or password! Please try again later.")
            })
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    return <>

        <Row gutter={[24, 5]} style={{}}>
            <Modal
                centered
                //width={"auto"}
                title={<center><b>Login as 🤔? </b></center>}
                closable={false}
                onCancel={() => {

                }}
                open={open}
                footer={null}
            >
                <Row gutter={[24, 10]}>
                    <Col xs={24} lg={8}>
                        <Card hoverable style={{ borderColor: "gray", height: 100 }}
                            onClick={() => {
                                setloginAs("Admin")
                                setopen(false)
                            }}
                        >
                            <center style={{ marginTop: 17 }}>
                                <b>🔒 ADMIN</b>
                            </center>
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card hoverable style={{ borderColor: "gray", height: 100 }}
                            onClick={() => {
                                setloginAs("Teacher")
                                setopen(false)
                            }}
                        >
                            <center style={{ marginTop: 17 }}>
                                <b>👩‍🏫 TEACHER</b>
                            </center>
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card hoverable style={{ borderColor: "gray", height: 100 }}
                            onClick={() => {
                                setloginAs("Student")
                                setopen(false)
                            }}
                        >
                            <center style={{ marginTop: 17 }}>
                                <b>👨‍🎓 STUDENT</b>
                            </center>
                        </Card>
                    </Col>
                </Row>
            </Modal>
            <Col xs={24} style={{ marginTop: window.innerHeight * .25 }}>
                <center>
                    <Card>
                        <h1> <img src={logo} width={100} /> Attendance - Sign In</h1>
                        <Form
                            layout="horizontal"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                maxWidth: 600,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    {`Login as ${loginAs}`}
                                </Button>
                            </Form.Item>

                            <Form.Item
                                name="remember"
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="link"
                                    onClick={() => {
                                        setopen(true)
                                        setloginAs("")
                                    }}
                                >
                                    Change Login?
                                </Button>
                            </Form.Item>


                        </Form>
                    </Card>
                </center>
            </Col>
        </Row>
    </>
}