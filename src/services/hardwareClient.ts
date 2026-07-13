export interface HardwareCommand {
  type: 'LED_DISPLAY' | 'COIL_ROTATE' | 'SERVO_DISPENSE' | 'NFC_READ' | 'QR_SCAN';
  payload: Record<string, any>;
}

export interface HardwareResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class HardwareClient {
  private isConnected: boolean = false;
  private deviceId: string | null = null;
  private simulationMode: boolean = true;

  async connect(deviceId: string): Promise<HardwareResponse> {
    if (this.simulationMode) {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.isConnected = true;
          this.deviceId = deviceId;
          resolve({ success: true, message: `Connected to device ${deviceId}` });
        }, 500);
      });
    }

    try {
      this.isConnected = true;
      this.deviceId = deviceId;
      return { success: true, message: 'Hardware connected' };
    } catch (error) {
      return { success: false, message: `Connection failed: ${error}` };
    }
  }

  async disconnect(): Promise<HardwareResponse> {
    this.isConnected = false;
    this.deviceId = null;
    return { success: true, message: 'Disconnected' };
  }

  async sendCommand(command: HardwareCommand): Promise<HardwareResponse> {
    if (!this.isConnected) {
      return { success: false, message: 'Hardware not connected' };
    }

    if (this.simulationMode) {
      return this.simulateCommand(command);
    }

    try {
      switch (command.type) {
        case 'LED_DISPLAY':
          return this.handleLedDisplay(command.payload);
        case 'COIL_ROTATE':
          return this.handleCoilRotate(command.payload);
        case 'SERVO_DISPENSE':
          return this.handleServoDispense(command.payload);
        default:
          return { success: false, message: 'Unknown command type' };
      }
    } catch (error) {
      return { success: false, message: `Command failed: ${error}` };
    }
  }

  private simulateCommand(command: HardwareCommand): Promise<HardwareResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: { simulated: true, command: command.type } });
      }, Math.random() * 200 + 100);
    });
  }

  private async handleLedDisplay(payload: Record<string, any>): Promise<HardwareResponse> {
    console.log('LED Display:', payload.message);
    return { success: true, message: 'LED updated' };
  }

  private async handleCoilRotate(payload: Record<string, any>): Promise<HardwareResponse> {
    console.log('Coil Rotate:', payload.slot, payload.rotations);
    return { success: true, message: 'Coil rotating' };
  }

  private async handleServoDispense(payload: Record<string, any>): Promise<HardwareResponse> {
    console.log('Servo Dispense:', payload.slot);
    return { success: true, message: 'Item dispensing' };
  }

  isHardwareConnected(): boolean {
    return this.isConnected;
  }

  getConnectedDeviceId(): string | null {
    return this.deviceId;
  }
}

export const hardwareClient = new HardwareClient();
