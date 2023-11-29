/* eslint-disable */
import { Row, Col, Card, Button, Table, Modal, Form, Input, DatePicker, notification, Upload, Image, Select, Space } from "antd";
import { getAllStudents, AddStudent, UpdateStudent, getStudentImage } from "../api";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/images/favicon.png"
import { ToTopOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import moment from "moment";

export default function Students() {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
      const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
      };
      const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
          <div
            style={{
              padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: 'block',
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({
                    closeDropdown: false,
                  });
                  setSearchText(selectedKeys[0]);
                  setSearchedColumn(dataIndex);
                }}
              >
                Filter
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  close();
                }}
              >
                close
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? '#1677ff' : undefined,
            }}
          />
        ),
        onFilter: (value, record) =>
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },
        render: (text) =>
          searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: '#ffc069',
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });

    const columns = [
        {
            title: "Student",
            ...getColumnSearchProps('name'),
            render: val => (
                <Row>
                    <Col xs={24} lg={7} hidden>
                        <Image src={`${val.image}`} width={60} height={60} style={{ borderRadius: 50 }} preview />
                    </Col>
                    <Col xs={24} lg={17}>
                        <span><b>Name: </b> {val.name}</span> <br />
                        <span><b>Birthdate:</b> {moment(val.birthdate).format("MM-DD-YYYY")}</span><br />
                        <span><b>Student ID: </b> {val.std_id}</span> 
                    </Col>
                </Row>
            )
        },
        {
            title: "Strand - Level",
            render: val => (
                <span>
                    <b>Strand: </b> {val.course} <br />
                    <b>Grade: </b> {val.year_level}
                </span>
            )
        },
        {
            title: "Parents",
            render: val => (
                <span>
                    <b>Name: </b>{val.parent}
                    <br />
                    <b>Contact #: </b>{val.parent_contact}
                </span>
            )
        },
        {
            title: <center>Action</center>,
            render: val => (
                <center>
                    <Row>
                        <Col lg={12} xs={24} style={{ marginBottom: 10 }}>
                            <Button
                                type={"primary"}
                                onClick={async () => {
                                    const image = await getStudentImage(val._id)
                                    .then(res=>{
                                        console.log(res.data)
                                        return res.data.image
                                    }).catch(err=>{
                                        console.log(err.message)
                                        return null
                                    })
                                    //console.log(image)
                                    if(image!==null){
                                        val.image = image
                                    }
                                    setshowadd(true)
                                    val.birthdate = moment(val.birthdate)
                                    setselStud(val)
                                    form.setFieldsValue(val)
                                }}
                            >
                                EDIT
                            </Button>
                        </Col>
                        <Col lg={12} xs={24}>
                            <Button
                                type={"danger"}
                                onClick={() => {

                                }}
                            >
                                DELETE
                            </Button>
                        </Col>

                    </Row>
                </center>
            )
        },
    ]

    const [list, setlist] = useState(null)
    const [showadd, setshowadd] = useState(false)
    const [selStud, setselStud] = useState(null)

    async function setStudents() {
        await getAllStudents()
            .then(res => {
                const data = res.data
                console.log(data)
                setlist(data.result)
            }).catch(err => {
                console.log(err.message)
                setlist(null)
            })
    }

    useEffect(() => {
        setStudents()
    },
        // eslint-disable-next-line
        [])

    const [form] = Form.useForm()
    const init = {
        "std_id": "",
        "name": "",
        "course": "",
        "year_level": "",
        "section": "",
        "birthdate": "",
        "parent": "",
        "parent_contact": "",
        "username": "",
        "password": "123456789"
    }
    // eslint-disable-next-line
    const [selectedFile, setselectedFile] = useState(null)
    const [selectedFileList, setselectedFileList] = useState([])
    const [imageUrl, setimageUrl] = useState("")

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const onChange = e => {
        if (e.file.type.includes("image")) {
            switch (e.file.status) {
                case "uploading":
                    setselectedFileList([e.file]);
                    setimageUrl("");
                    console.log("uploading")
                    console.log(e.file)
                    break;
                case "done":
                    console.log(e.file)
                    setselectedFile(e.file.originFileObj);
                    setselectedFileList([e.file]);
                    getBase64(e.file.originFileObj, (url) => {
                        setimageUrl(url);
                    });

                    break;

                default:
                    setimageUrl("");
                    setselectedFile(null);
                    setselectedFileList([]);
            }
        } else {
            notification.info({
                message: "Select an image file only!"
            })
        }

    };

    function clear() {
        setshowadd(false)
        setselStud(null)
        form.resetFields()
        setimageUrl('')
        setselectedFileList([])
    }
    const [saving, setsaving] = useState(false)

    async function Add(file, values) {
        try {
            if (file !== null) {
                const formData = new FormData();
                formData.append("File", file);
                formData.append("body", JSON.stringify(values));

                await AddStudent(formData)
                    .then(res => {
                        console.log(res.data)
                        if (res.data.isAdded) {
                            notification.success({
                                message: "Student Successfully Added!",
                                placement: "topRight"
                            })
                            setStudents()
                            setTimeout(() => {
                                setsaving(false)
                                clear()
                            }, 1500)
                        } else {
                            notification.warning({
                                message: res.data.msg,
                                placement: "topRight"
                            })
                            setTimeout(() => {
                                setsaving(false)
                            }, 1500)
                        }
                    }).catch(err => {
                        console.error(err.message)
                        setsaving(false)
                        notification.error({
                            message: "Server Error! please try again later!",
                            placement: "topRight"
                        })
                    })
            } else {
                notification.info({
                    message: "Please insert/select a image!"
                })
            }
        } catch (err) {
            console.log(err.message)
            setsaving(false)
        }
    }

    async function Update(file, values, selStud) {
        let formData = new FormData();     
        values._id = selStud._id
        if(file==null){
            formData.append("body", JSON.stringify(values));
        } else {
            if(imageUrl!==""){ values.image = imageUrl; values.updateImage = true }
            formData.append("File", file);
            formData.append("body", JSON.stringify(values));
        }
        await UpdateStudent(formData)
        .then(res=>{
            if(res.data.updated){
                alert("Successfully Updated!")
                setStudents()
                clear()
            } else {
                alert("Unable to detect face, please try another image!")
            }
            setsaving(false)
        }).catch(err=>{
            alert(err.message)
            setsaving(false)
        })

        
    }

    async function Submit(what, values) {
        try {
            setsaving(true)
            console.log(values)
            if (what === "Update") {
                Update(selectedFile, values, selStud)
            } else {
                Add(selectedFile, values)
            }
        } catch (err) {
            console.log(err.message)
            console.log(" here")
        }
    }

    return <>
        <Modal
            title="Add Student"
            onCancel={() => {
                if(!saving){
                    setshowadd(false)
                    clear()
                }
            }}
            open={showadd}
            footer={[
                <center>
                    <Button
                        type={"danger"}
                        onClick={() => {
                            setshowadd(false)
                            clear()
                        }}
                    >
                        CANCEL
                    </Button>
                    <Button
                        type={"primary"}
                        loading={saving}
                        onClick={() => {
                            form.submit()
                        }}
                    >
                        {
                            selStud === null ? saving? "SUBMITTING" : "SUBMIT" : saving? "UPDATING" : "UPDATE"
                        }
                    </Button>
                </center>
            ]}
        >
            <Form
                form={form}
                initialValues={init}
                onFinish={async (values) => {
                    console.log(values)
                    if (selStud === null) {
                        if (imageUrl === "" && selectedFile === null) {
                            notification.warning({
                                message: "Please select/insert a product image to upload!",
                                placement: "topRight"
                            })
                        } else {
                            values.image = imageUrl
                            await Submit("Add", values)
                        }
                    }
                    //update
                    else {
                        if (imageUrl === "" && selectedFile === null) {
                            //dont update image
                            await Submit("Update", values, false)
                        } else {
                            //update image
                            await Submit("Update", values, true)
                        }
                    }


                }}
                onFinishFailed={err => {
                    console.log(err)
                    notification.warn({
                        message: "Please fill in the from completely!"
                    })
                }}
                alignment="horizontal"
            >
                <Row gutter={[24, 5]}>
                    <Col xs={24}>
                        <b>Basic Information</b>
                        <hr/>
                        <center>
                            <Upload
                                fileList={selectedFileList}
                                customRequest={dummyRequest}
                                onChange={e => {
                                    console.log(e)
                                    onChange(e)
                                }}
                            >

                                <Col xs={24} >
                                    <Image
                                        style={{ pointer: "cursor", borderRadius: 100 }}
                                        width={200}
                                        height={200}
                                        src={selStud === null ? imageUrl : imageUrl!==""? imageUrl : selStud.image}
                                        fallback={logo}
                                        preview={false}
                                    />
                                </Col>

                                <center>
                                    <Button type="link" style={{ color: "black" }} >
                                        <ToTopOutlined style={{ fontSize: 20, color: "green" }} /> {"SELECT AN IMAGE"}
                                    </Button>
                                </center>
                            </Upload>

                        </center>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="std_id"
                            label="Student ID"
                            rules={[
                                { required: true, message: "Please input student ID!" },
                            ]}
                        >
                            <Input type="text" placeholder="" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="name"
                            label="Fullname"
                            rules={[
                                { required: true, message: "Please input your fullname!" },
                            ]}
                        >
                            <Input type="text" placeholder="e.g. John Doe" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="course"
                            label="Strand"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Input type="text" placeholder="" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="year_level"
                            label="Grade"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Select
                                style={{
                                    width: "100%",
                                }}
                                options={[
                                    {
                                        label: 'Grade 11',
                                        value: 'Grade 11',
                                    },
                                    {
                                        label: 'Grade 12',
                                        value: 'Grade 12',
                                    },
                                    {
                                        label: 'I',
                                        value: 'I',
                                    },
                                    {
                                        label: 'II',
                                        value: 'II',
                                    },
                                    {
                                        label: 'III',
                                        value: 'III',
                                    },
                                    {
                                        label: 'IV',
                                        value: 'IV',
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="Section"
                            label="Section"
                            rules={[
                                { required: false, message: "Please fill in this field!" },
                            ]}
                        >
                            <Input type="text" placeholder="" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="birthdate"
                            label="Birthdate"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <DatePicker style={{ width: "100%" }} format={"MM-DD-YYYY"} placeholder="MM-DD-YYYY" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="parent"
                            label="Parent"
                            rules={[
                                { required: true, message: "Please fill in this field!" },
                            ]}
                        >
                            <Input type="text" placeholder="" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="parent_contact"
                            label="Parent Contact"
                            rules={[
                                { required: true, message: "Please input parent contact!" },
                            ]}
                        >
                            <Input type="number" placeholder="e.g.09123456789" />
                        </Form.Item>
                    </Col>
                    
                    <Col xs={24}>
                        <b>Account Details</b>
                        <hr/>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[
                                { required: true, message: "Please enter username!" },
                            ]}
                        >
                            <Input type="text" placeholder="username" />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                { required: true, message: "Please enter password!" },
                            ]}
                        >
                            <Input.Password size="small" placeholder="password" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
        <Row gutter={[24, 5]}>
            <Col xs={24}>

            </Col>
            <Col xs={24}>
                <Card
                    bordered
                    title={
                        <Row gutter={[24, 5]}>\
                            <Col xs={24} lg={17}>
                                <b>List of Students</b>
                            </Col>
                            <Col xs={24} lg={6} >
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setshowadd(true)
                                    }}
                                    style={{ float: "right" }}
                                >
                                    Add Student
                                </Button>
                            </Col>
                        </Row>
                    }
                >
                    <Table
                        className="ant-list-box table-responsive"
                        columns={columns}
                        loading={list===null}
                        dataSource={list}
                    />
                </Card>
            </Col>
        </Row>
    </>
}
