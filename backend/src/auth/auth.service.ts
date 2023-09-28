import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import RefreshToken from './entities/refresh-token.entity';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private refreshTokens: RefreshToken[] = [];

  constructor(private readonly userService: UsersService) {}

  async refresh(
    refreshStr: string,
  ): Promise<{ accessToken: string } | undefined> {
    if (refreshStr) {
      const refreshToken = await this.retrieveRefreshToken(refreshStr);
      if (!refreshToken) {
        throw new HttpException('Invalid refresh token', 401);
      }

      const user = await this.userService.findOne(refreshToken.userId);
      if (!user) {
        throw new HttpException('Invalid refresh token', 401);
      }

      const accessToken = {
        userId: refreshToken.userId,
      };

      return {
        accessToken: sign(accessToken, process.env.ACCESS_SECRET, {
          expiresIn: '1h',
        }),
      };
    } else {
      throw new HttpException('Parameters are empty', 400);
    }
  }

  private retrieveRefreshToken(
    refreshStr: string,
  ): Promise<RefreshToken | undefined> {
    try {
      const decoded = verify(refreshStr, process.env.REFRESH_SECRET);
      if (typeof decoded === 'string') {
        return undefined;
      }
      return Promise.resolve(
        this.refreshTokens.find((token) => token._id === decoded._id),
      );
    } catch (e) {
      return undefined;
    }
  }

  async login(
    email: string,
    password: string,
    values: { userAgent: string; ipAddress: string },
  ): Promise<{ accessToken: string; refreshToken: string } | undefined> {
    if (email && password) {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        return undefined;
      }

      if (user.password !== password) {
        return undefined;
      }

      return this.newRefreshAndAccessToken(user, values);
    } else {
      throw new HttpException('Parameters are empty', 400);
    }
  }

  private async newRefreshAndAccessToken(
    user: User,
    values: { userAgent: string; ipAddress: string },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshObject = new RefreshToken({
      _id:
        this.refreshTokens.length === 0
          ? ''
          : this.refreshTokens[this.refreshTokens.length - 1]._id + 1,
      ...values,
      userId: user._id,
    });
    this.refreshTokens.push(refreshObject);

    return {
      refreshToken: refreshObject.sign(),
      accessToken: sign(
        {
          userId: user._id,
        },
        process.env.ACCESS_SECRET,
        {
          expiresIn: '1h',
        },
      ),
    };
  }

  async logout(refreshStr): Promise<void> {
    if (refreshStr) {
      const refreshToken = await this.retrieveRefreshToken(refreshStr);

      if (!refreshToken) return;

      this.refreshTokens = this.refreshTokens.filter(
        (refreshToken) => refreshToken._id !== refreshToken._id,
      );
    } else {
      throw new HttpException('Parameters are empty', 400);
    }
  }
}
