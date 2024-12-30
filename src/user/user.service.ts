import { UnauthorizedException, HttpStatus, Logger } from '@nestjs/common';
import {
  CreateUserByAdminDto,
  CreateUserDto,
  DeleteUserDto,
  GetUserDto,
  RefreshAccessToken,
  UserLoginDto,
  UserLogoutDto,
} from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

import { SendOtpDto } from './dto/send-otp.dto';
import * as nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import { Otp } from './entities/otp.entity';
import { VerifyOtpDto } from './dto/verify-otp.dto';

import { SignAccessToken, SignRefreshToken } from 'src/utils/signToken.utils';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RefreshToken } from './entities/refreshToken.entity';
import { VerifyRefreshToken } from 'src/utils/verifyToken.utils';
import { Role } from 'src/utils/roles.enum';

import { StudentProfile } from 'src/profile/entities/student-profile.entity';
import { Op } from 'sequelize';
import { UpdateUserDto } from './dto/update-user.dto';
import { TeacherProfile } from 'src/profile/entities/teacher-profile.entity';
import { Multer } from 'multer';
import { unlink } from 'fs/promises';
import { JoinTeacherSubjectLevel } from 'src/profile/entities/join-teacher-subject-level.entity';
import { Chat } from 'src/chat/entities/chat.entity';

export class UserService {
  constructor(private readonly logger = new Logger('UserService')) { }


  private generateOtp(): string {
    const otp = randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    return otp;
  }

  async sendOtpToEmail(sendOtpDto: SendOtpDto) {
    const otp = this.generateOtp();

    try {
      // Check if an OTP already exists for the email
      const existingOtp = await Otp.findOne({
        where: { email: sendOtpDto.email },
      });

      if (existingOtp) {
        // Update the existing record
        existingOtp.otp = otp;
        existingOtp.isVerified = false;
        existingOtp.updatedAt = new Date();
        await existingOtp.save();
      } else {
        // Create a new OTP record
        const otpRecord = new Otp();
        otpRecord.otp = otp;
        otpRecord.email = sendOtpDto.email;
        otpRecord.isVerified = false;
        await otpRecord.save();
      }

      this.logger.log(
        `The OTP is ${otp}, ${sendOtpDto.email}, ${process.env.EMAIL_HOST} `,
      );

      const transporter = nodemailer.createTransport({
        host: `${process.env.EMAIL_HOST}`,
        port: Number(`${process.env.EMAIL_PORT}`),
        secure: false,
        auth: {
          user: `${process.env.EMAIL_USERNAME}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        },
      });

      // Send email
      await transporter.sendMail({
        from: `${process.env.EMAIL_FROM_ADDRESS}`,
        to: sendOtpDto.email, // Use the provided email
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}`,
        html: `<p>Your OTP is <strong>${otp}</strong></p>`,
      });

      return {
        message: 'OTP sent successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error('Error sending OTP', error);
      throw new Error('Failed to send OTP');
    }
  }

  async verifyOtp(verifyOtp: VerifyOtpDto) {
    const otpRecord = await Otp.findOne({
      where: {
        otp: verifyOtp.otp,
        email: verifyOtp.email,
      },
    });

    if (!otpRecord) {
      throw new Error('Invalid and Expired OTP');
    }
    const user = await User.findOne({
      where: {
        email: verifyOtp.email,
      },
    });

    if (!user) {
      throw new Error('Unable to Verify User');
    }

    const otpExpiry = new Date(otpRecord.createdAt);
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
    if (new Date() > otpExpiry) {
      otpRecord.destroy();
      throw new Error('Invalid or Expired OTP ');
    }

    otpRecord.isVerified = true;
    await otpRecord.save();

    return {
      message: 'OTP verified successfully',
      statusCode: HttpStatus.OK,
      data: {
        success: true,
      },
    };
  }

  async updateUser(updateUserDto: UpdateUserDto, req: any) {
    const { name, contact, email, id, isVerified } = updateUserDto;

    await User.update({
      email,
      contact,
      name,
      isVerified
    }, {
      where: {
        id: {
          [Op.eq]: id
        }
      }
    })

    return {
      message: 'Successfully updated the user',
      statusCode: HttpStatus.OK,
    };
  }

  async updatePassword(createForgotDto: UpdatePasswordDto, req: any) {
    const { password, otp, email } = createForgotDto;

    const otpRecord = await Otp.findOne({
      where: {
        otp,
        email,
        isVerified: true,
      },
    });

    if (!otpRecord) {
      throw new Error('Unable to Update password');
    }
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('Unable to Update password');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    await otpRecord.destroy();

    return {
      message: 'Successfully updated the password',
      statusCode: HttpStatus.OK,
    };
  }


  async deleteTeacher(deleteUserDto: DeleteUserDto) {
    try {

      await JoinTeacherSubjectLevel.destroy({
        where: {
          teacher_id: {
            [Op.eq]: deleteUserDto.user_id
          }
        }
      }).then(async () => {
        await TeacherProfile.destroy({
          where: {
            user_id: {
              [Op.eq]: deleteUserDto.user_id
            }
          }
        }).then(async () => {
          await Otp.destroy({
            where: {
              user_id: {
                [Op.eq]: deleteUserDto.user_id
              }
            }
          })
          await Chat.destroy({
            where: {
              user_id: {
                [Op.eq]: deleteUserDto.user_id
              }
            }
          })
          await RefreshToken.destroy({
            where: {
              user_id: {
                [Op.eq]: deleteUserDto.user_id
              }
            }
          })
          await User.destroy({
            where: {
              id: {
                [Op.eq]: deleteUserDto.user_id
              }
            }
          })
        })
      })


      return {
        statusCode: 200,
        message: "success deleting user"
      }
    } catch (error) {
      throw new Error("ERROR DELETING USER")
    }
  }

  async deleteUser(deleteUserDto: DeleteUserDto) {
    try {

      await StudentProfile.destroy({
        where: {
          user_id: {
            [Op.eq]: deleteUserDto.user_id
          }
        }
      }).then(async () => {
        await Otp.destroy({
          where: {
            user_id: {
              [Op.eq]: deleteUserDto.user_id
            }
          }
        })
        await Chat.destroy({
          where: {
            user_id: {
              [Op.eq]: deleteUserDto.user_id
            }
          }
        })
        await RefreshToken.destroy({
          where: {
            user_id: {
              [Op.eq]: deleteUserDto.user_id
            }
          }
        })
        await User.destroy({
          where: {
            id: {
              [Op.eq]: deleteUserDto.user_id
            }
          }
        })
      })
      return {
        statusCode: 200,
        message: "success deleting user"
      }
    } catch (error) {
      throw new Error("ERROR DELETING USER")
    }
  }

  async createUser(createUserByAdminDto: CreateUserByAdminDto) {
    const existingUser = await User.findOne({
      where: { email: createUserByAdminDto.email },
    });
    if (existingUser) {
      return {
        message: 'User Already Exist',
        statusCode: 1000,
        user: {
          isVerified: existingUser.isVerified,
        },
      };
    }
    const hashedPassword = await bcrypt.hash(createUserByAdminDto.password != "" ? createUserByAdminDto.password : "123", 10);

    const res = await User.create({
      name: createUserByAdminDto.name,
      email: createUserByAdminDto.email,
      password: hashedPassword,
      contact: createUserByAdminDto.contact,
      role: createUserByAdminDto.role,
      isVerified: true
    }).then(async (u) => {
      if (createUserByAdminDto.role == Role.USER) {
        await StudentProfile.create({
          level_id: createUserByAdminDto.level_id,
          user_id: u.id,
          user_roll_no: createUserByAdminDto.user_roll_no,
          id: u.id
        })
      } else if (createUserByAdminDto.role == Role.TEACHER) {
        await TeacherProfile.create({
          user_id: u.id,
          id: u.id,
          title: "",
          level_id: createUserByAdminDto.level_id
        })
      }

      return u
    });
    return {
      message: 'create user successfully registered.',
      statusCode: HttpStatus.OK,
      data: {
        id: res.id,
        name: res.name,
        email: res.email,
      },
    };
  }



  async signup(createUserDto: CreateUserDto) {
    console.log(createUserDto)

    const existingUser = await User.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      return {
        message: 'Email Already Exist',
        statusCode: 1000,
        user: {
          isVerified: existingUser.isVerified,
        },
      };
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new User();
    newUser.name = createUserDto.name;
    newUser.email = createUserDto.email;
    newUser.password = hashedPassword;
    newUser.contact = createUserDto.contact;
    newUser.role = Role.USER
    newUser.save().then(async (u) => {
      await StudentProfile.create({
        level_id: null,
        user_id: u.id,
        user_roll_no: "",
        id: u.id
      })
    });

    await this.sendOtpToEmail({ email: newUser.email })
      .then(() => {
        return {
          message: 'You have successfully registered.',
          statusCode: HttpStatus.OK,
          data: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          },
        };
      })
      .catch(() => {
        throw new Error("Unable to email verification code")
      })

  }

  async verifyUser(verifyOtp: VerifyOtpDto) {
    const otpRecord = await Otp.findOne({
      where: {
        otp: verifyOtp.otp,
        email: verifyOtp.email,
      },
    });

    if (!otpRecord) {
      throw new Error('Invalid and Expired OTP');
    }
    const user = await User.findOne({
      where: {
        email: verifyOtp.email,
      },
    });

    if (!user) {
      throw new Error('Unable to Verify User');
    }

    const otpExpiry = new Date(otpRecord.createdAt);
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
    if (new Date() > otpExpiry) {
      otpRecord.destroy();
      throw new Error('Invalid or Expired OTP ');
    }

    user.isVerified = true;
    await user.save();

    await otpRecord.destroy();

    return {
      message: 'OTP verified successfully',
      statusCode: HttpStatus.OK,
      data: {
        success: true,
      },
    };
  }

  async generateRefreshToken(payload: {
    sub: number;
    email: string;
    level_id: number | null;
    role: string
  }): Promise<string> {
    const refreshToken = SignRefreshToken(payload);
    try {
      await RefreshToken.create({
        user_id: payload.sub,
        refresh_token: refreshToken
      })
      return refreshToken;
    } catch (error) {
      return '';
    }
  }

  async refreshAccessToken(refreshAccessToken: RefreshAccessToken) {
    const { refresh_token } = refreshAccessToken;

    const token_exist = await RefreshToken.findOne({
      where: {
        refresh_token,
      },
    });

    if (!token_exist) {
      throw new Error('Invalid or expired refresh token');
    }

    const verifyToken: any = await VerifyRefreshToken(refresh_token);

    if (verifyToken.email == '') {
      throw new Error('Token expired or invalid');
    }

    const payload = { sub: verifyToken?.sub, email: verifyToken.email, role: verifyToken?.role, level_id: verifyToken?.level_id ? verifyToken.level_id : null };

    console.log("payload in refresh access token", payload)
    const accessToken = SignAccessToken(payload);

    return {
      accessToken: accessToken,
      statusCode: 200,
    };
  }

  async logout(userLogoutDto: UserLogoutDto) {
    const { refresh_token } = userLogoutDto;
    console.log("logout")
    try {
      await RefreshToken.destroy({
        where: {
          refresh_token: {
            [Op.eq]: refresh_token
          },
        },
      });
      return {
        message: 'LogOut successful',
        statusCode: 200,
      };
    } catch (error) {
      throw new Error('Failed To LogOut');
    }
  }

  async login(userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;
    this.logger.log(`USER login creadentaila , ${userLoginDto}`);
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('No User exist');
    }

    let profile: any;
    if (user.role == Role.USER) {
      profile = await StudentProfile.findOne({
        where: {
          user_id: {
            [Op.eq]: user.id
          }
        }
      })
    } else if (user.role == Role.TEACHER) {
      profile = await TeacherProfile.findOne({
        where: {
          user_id: {
            [Op.eq]: user.id
          }
        }
      })
    }
    this.logger.log(`USER in db , ${user}`);

    this.logger.log(`USER in db , ${user.password} \n ${password}`);
    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    //check if refresh token already exist as user id is unique
    const refresh_token_exist = await RefreshToken.findOne({
      where: {
        user_id: {
          [Op.eq]: user?.id
        }
      }
    })

    let refreshToken = ""
    const payload = { sub: user.id, email: user.email, role: user?.role, level_id: profile?.level_id ? profile.level_id : null };
    if (refresh_token_exist) {
      refreshToken = refresh_token_exist?.refresh_token
      console.log("using old refresh key")
    } else {
      refreshToken = await this.generateRefreshToken(payload);
      console.log("using new refresh key")
    }

    if (refreshToken == '') {
      throw new Error('Fialed to LogIn');
    }
    const accessToken = SignAccessToken(payload);

    this.logger.log(
      `jwt access token ${accessToken} \n jwt refresh token ${refreshToken}`,
    );
    return {
      message: 'Login successful.',
      statusCode: 200,
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          level_id: profile?.level_id ? profile.level_id : null,

        },
      },
    };
  }


  async getAllUsersByRole(role: Role, req: any) {
    try {
      const students = await User.findAll({
        attributes: {
          exclude: ["password"]
        },
        where: {

          role: {
            [Op.eq]: role
          }
        },

      })

      return {
        statusCode: 200,
        users: students
      }

    } catch (error) {
      throw new Error("Error fetching students")
    }
  }


  async updateAvatar(image: Express.Multer.File, req: any) {
    try {
      const user = await User.findByPk(req.user.sub, {
        attributes: ["user_image_url"]
      })

      if (user?.user_image_url != "") {
        await unlink(user.user_image_url);
      }

      await User.update({
        user_image_url: image.path
      }, {
        where: {
          id: {
            [Op.eq]: req.user.sub
          }
        }
      })

      return {
        statusCode: 200,
        message: "success updating avatar"
      }

    } catch (error) {
      throw new Error("Error updating avatar")
    }
  }

  async getUser(getStudentDto: GetUserDto, req: any) {
    try {
      const student = await User.findByPk(getStudentDto.user_id, {
        attributes: {
          exclude: ["password"]
        },
      })

      return {
        statusCode: 200,
        data: student
      }

    } catch (error) {
      throw new Error("Error fetching students")
    }
  }

}
