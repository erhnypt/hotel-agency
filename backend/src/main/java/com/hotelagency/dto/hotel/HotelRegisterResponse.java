package com.hotelagency.dto.hotel;

import com.hotelagency.dto.auth.AuthResponse;

public record HotelRegisterResponse(HotelResponse hotel, AuthResponse auth) {
}
