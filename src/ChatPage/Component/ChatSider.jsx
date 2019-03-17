import React, { Component } from "react";
import { Layout, Menu, Icon, Divider, Popover } from 'antd';
import "antd/dist/antd.css";
import './ChatSider.css';

export default class ChatSider extends Component {
    render() {
        const {Sider} = Layout;
        const SubMenu = Menu.SubMenu;
        return (
            <Sider className='sider'>
                <div className='chat-header'>
                    <Popover
                    content={<a href='/' onClick={this.props.handleLogOut}>Log Out</a>}
                    trigger='click'
                    placement='bottomLeft'
                    visible={this.props.state.settingVisible}
                    onVisibleChange={this.props.handlePopOverChange}
                    >
                        <Icon type='setting'/>
                    </Popover>
                    <span>Chat</span>
                    <Icon onClick={this.props.handleCreateGroup} type='plus'/>
                </div>
                <div className='divider'><Divider/></div>
                <Menu
                theme='dark' mode='inline'
                defaultOpenKeys={['joinedGroup']}
                selectedKeys={[this.props.state.selected]}
                onSelect={this.props.handleMenuSelect}
                >
                    <SubMenu key='joinedGroup' title={<span><Icon type="check-circle"/>Joined group</span>}>
                        { this.props.state.joinedList.map((group) => 
                            <Menu.Item key={'j'+group}>{group}</Menu.Item>
                        ) }
                    </SubMenu>
                    <SubMenu key='allGroup' title={<span><Icon type="bars"/>All Group</span>}>
                        { this.props.state.allList.map((group) => 
                            <Menu.Item key={'a'+group}>{group}</Menu.Item>
                        ) }
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }
}