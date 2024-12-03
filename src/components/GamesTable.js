import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';

const GamesTable = () => {
    const [games, setGames] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingGame, setEditingGame] = useState(null);

    // Fetch games from the backend
    const fetchGames = async () => {
        try {
            const response = await fetch('/games/node1'); // Adjust the endpoint if needed
            const data = await response.json();
            setGames(data);
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };

    // Show the modal to add or edit a game
    const handleAdd = () => {
        setEditingGame(null); // Clear the form for new entries
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (game) => {
        setEditingGame(game);
        form.setFieldsValue(game); // Populate form with the game data
        setIsModalVisible(true);
    };

    const handleDelete = async (app_id) => {
        try {
            await fetch(`/games/node1/${app_id}`, { method: 'DELETE' });
            fetchGames();
        } catch (error) {
            console.error('Error deleting game:', error);
        }
    };

    const handleSave = async (values) => {
        try {
            if (editingGame) {
                // Update existing game
                await fetch(`/games/node1/${editingGame.app_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });
            } else {
                // Add new game
                await fetch('/games/node1', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });
            }
            setIsModalVisible(false);
            fetchGames();
        } catch (error) {
            console.error('Error saving game:', error);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const columns = [
        { title: 'App ID', dataIndex: 'app_id', key: 'app_id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Release Date', dataIndex: 'release_date', key: 'release_date' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        { title: 'Developers', dataIndex: 'developers', key: 'developers' },
        { title: 'Publishers', dataIndex: 'publishers', key: 'publishers' },
        {
            title: 'Actions',
            render: (text, record) => (
                <>
                    <Button onClick={() => handleEdit(record)}>Edit</Button>
                    <Button onClick={() => handleDelete(record.app_id)} danger>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={handleAdd}>
                Add Game
            </Button>
            <Table columns={columns} dataSource={games} rowKey="app_id" />
            <Modal
                title={editingGame ? 'Edit Game' : 'Add Game'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => {
                    form.validateFields().then(handleSave).catch((err) => console.error(err));
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="app_id"
                        label="App ID"
                        rules={[{ required: true, message: 'App ID is required' }]}
                    >
                        <Input disabled={!!editingGame} />
                    </Form.Item>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="release_date" label="Release Date" rules={[{ required: true }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="developers" label="Developers" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="publishers" label="Publishers" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default GamesTable;
