import * as signalR from '@microsoft/signalr';

export interface CartSignalRService {
    connection: signalR.HubConnection | null;
    startConnection: () => Promise<void>;
    stopConnection: () => Promise<void>;
    joinCartGroup: (userId: string) => Promise<void>;
    leaveCartGroup: (userId: string) => Promise<void>;
    onCartItemUpdated: (callback: (cartItem: any) => void) => void;
    onCartItemRemoved: (callback: (productId: number) => void) => void;
    onCartCleared: (callback: () => void) => void;
    onCartCountUpdated: (callback: (count: number) => void) => void;
}

class CartSignalRServiceImpl implements CartSignalRService {
    public connection: signalR.HubConnection | null = null;

    public async startConnection(): Promise<void> {
        if (this.connection) {
            return;
        }

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5214/cartHub', {
                withCredentials: true
            })
            .withAutomaticReconnect()
            .build();

        try {
            await this.connection.start();
            console.log('SignalR Connected to CartHub');
        } catch (error) {
            console.error('SignalR Connection failed:', error);
            throw error;
        }
    }

    public async stopConnection(): Promise<void> {
        if (this.connection) {
            await this.connection.stop();
            this.connection = null;
            console.log('SignalR Disconnected from CartHub');
        }
    }

    public async joinCartGroup(userId: string): Promise<void> {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            try {
                await this.connection.invoke('JoinCartGroup', userId);
                console.log(`Joined cart group for user: ${userId}`);
            } catch (error) {
                console.error('Failed to join cart group:', error);
            }
        }
    }

    public async leaveCartGroup(userId: string): Promise<void> {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            try {
                await this.connection.invoke('LeaveCartGroup', userId);
                console.log(`Left cart group for user: ${userId}`);
            } catch (error) {
                console.error('Failed to leave cart group:', error);
            }
        }
    }

    public onCartItemUpdated(callback: (cartItem: any) => void): void {
        if (this.connection) {
            this.connection.on('CartItemUpdated', callback);
        }
    }

    public onCartItemRemoved(callback: (productId: number) => void): void {
        if (this.connection) {
            this.connection.on('CartItemRemoved', callback);
        }
    }

    public onCartCleared(callback: () => void): void {
        if (this.connection) {
            this.connection.on('CartCleared', callback);
        }
    }

    public onCartCountUpdated(callback: (count: number) => void): void {
        if (this.connection) {
            this.connection.on('CartCountUpdated', callback);
        }
    }
}

// Singleton instance
export const cartSignalRService = new CartSignalRServiceImpl();
