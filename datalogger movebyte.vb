#IfDef c_lorawan_modem_installed 
#the MoveBytes instruction is used to move binary bytes of data into a different memory location.
#Syntax

#MoveBytes ( Destination, DestOffset, Source, SourceOffset, NumBytes, Transfer [optional] )

  Function lorawan_send_data()
    If LoRaWan_send_data_now = 1 OR IfTime (5,10, Min) Then

      Dim i As Long
      LoRaWan_out_data = c_lorawan_station_label
      MoveBytes (LoRaWan_out_data,1,Station_status,0,2,3)
      MoveBytes (LoRaWan_out_data,3,Alarm_status,0,2,3)
      For i=1 To c_number_of_remote_stations
        MoveBytes (LoRaWan_out_data,i*4+1,Remote_station_status(i),0,2,3)
        MoveBytes (LoRaWan_out_data,i*4+3,Remote_alarm_status(i),0,2,3)
      Next i
      LoRaWan_out_data_len = 4*c_number_of_remote_stations + 5
      
      Dim sw12_last_state As Boolean
      sw12_last_state = Status.SW12Volts(1,1)
      If sw12_last_state = false Then 
        SW12(1)
        Delay (0,3,Sec)
      EndIf
      SerialOpen (c_lorawan_com_port,9600,3,0,100)
      SerialOutBlock (c_lorawan_com_port,LoRaWan_out_data,LoRaWan_out_data_len)
      SerialClose(c_lorawan_com_port)
      If sw12_last_state = false Then SW12(0)
      LoRaWan_send_data_now = 0
    End If  
  EndFunction