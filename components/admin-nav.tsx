import {Button, Menu} from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import React, {useState} from "react";
import "../styles/admin-nav.module.less";
import {MenuOutlined, PieChartOutlined, PicLeftOutlined, ShoppingCartOutlined, DatabaseOutlined, PictureOutlined} from "@ant-design/icons";
import Link from "next/link";
import {FileDoneOutlined} from "@ant-design/icons/lib";

export default function AdminNav({children}) {
    const [collapsed, setCollapsed] = useState(true);
    //
    function toggleCollapsed() {
        setCollapsed(!collapsed);
    }

    function handleClick() {
        console.log('click')
    }
    return(
      <>
          <section id="toolbar">
              <div className="logo flex" style={{alignItems: 'center'}}>
                  <button className="mr-4 text-xl" onClick={toggleCollapsed}><MenuOutlined /></button>
                  <h1 className="font-nectar brand">BICHE</h1>
                  <span className="ml-2">Admin</span>
              </div>
          </section>
          <section id="side-nav" style={{width: collapsed ? 56 : 256}}>
              <Menu
                  onClick={handleClick}
                  style={{ width: collapsed ? 56 : 256, height: '100%', transition: '0.3s linear' }}
                  mode="inline"
                  theme="dark"
                  inlineCollapsed={collapsed}
              >
                  <Menu.Item key="dashboard" icon={<PieChartOutlined />}>
                      <Link href="/admin/dashboard">Dashboard</Link>
                  </Menu.Item>
                  <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
                      <Link href="/admin/orders">Orders</Link>
                  </Menu.Item>
                  <Menu.Item key="bookings" icon={<FileDoneOutlined />}>
                      <Link href="/admin/bookings">Bookings</Link>
                  </Menu.Item>
                  <SubMenu
                      key="items"
                      title={
                          <span>
                            <DatabaseOutlined />
                            <span>Inventory</span>
                          </span>
                          }
                  >
                      <Menu.Item key="view-items">
                          <Link href={'/admin/items'}>
                              <a>All Items</a>
                          </Link>
                      </Menu.Item>
                      <Menu.Item key="item-cat">
                          <Link href="/admin/items/categories">
                              <a>Item categories</a>
                          </Link>
                      </Menu.Item>
                      <Menu.Item key="add-item">
                          <Link href="/admin/items/add">
                              <a>+ Add Item</a>
                          </Link>
                      </Menu.Item>
                      {/*<Menu.Item key="add-cat">+ Item category</Menu.Item>*/}
                  </SubMenu>
                  <SubMenu
                      key="blog-sub"
                      title={
                          <span>
                            <PicLeftOutlined />
                            <span>Blog post</span>
                          </span>
                      }
                  >
                      <Menu.Item key="all-post">
                          <Link href="/admin/blog">All posts</Link>
                      </Menu.Item>
                      <Menu.Item key="add-post">+ Add post</Menu.Item>
                  </SubMenu>
                  {/*<Menu.Item key="settings" icon={<SettingOutlined />}>Settings</Menu.Item>*/}
                  <Menu.Item key="journal-menu" icon={<PictureOutlined />}>
                      <Link href="/admin/journal">Journal</Link>
                  </Menu.Item>
              </Menu>
          </section>
          <section id="section__body" style={{left: collapsed ? 56 : 256}}>{children}</section>
      </>
    );
}
