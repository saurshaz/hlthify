from fastapi import Request
import time
from typing import Dict, Tuple

class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, list] = {}
        
    async def is_rate_limited(self, request: Request) -> Tuple[bool, float]:
        now = time.time()
        client_ip = request.client.host
        
        if client_ip not in self.requests:
            self.requests[client_ip] = []
            
        # Remove old requests
        self.requests[client_ip] = [req_time for req_time in self.requests[client_ip] 
                                  if now - req_time < 60]
        
        if len(self.requests[client_ip]) >= self.requests_per_minute:
            wait_time = 60 - (now - self.requests[client_ip][0])
            return True, wait_time
            
        self.requests[client_ip].append(now)
        return False, 0
