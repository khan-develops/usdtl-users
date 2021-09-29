import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Constants } from './constants';
import { JwtPayload } from './jwt-payload.model';
import { IUser } from './user.model';

@Injectable()
export class UserService {

  constructor(
    private jwtService: JwtService
  ) { }

  async authenticateUser(username, password) {
    let isAuthenticated = false
    let group: string | undefined
    let profile: IUser | undefined
    const userPrincipalName = `${username}@usdtl.com`
    const ActiveDirectory = require('activedirectory');
    const config = {
      url: 'LDAP://VMDC1.USDTL.COM:389',
      baseDN: 'CN=Users,DC=usdtl,DC=com',
      username: userPrincipalName,
      password: password
    }
    var ad = new ActiveDirectory(config);
    ad.authenticate(userPrincipalName, password, function (err, auth) {
      if (err) {
        throw new UnauthorizedException()
      }
      if (auth) {
        isAuthenticated = true
        ad.findUser(userPrincipalName, function (err, user) {
          if (!user)
            throw new NotFoundException()
          else
            profile = user
            Constants.groups.map(groupName => {
            ad.isUserMemberOf(username, groupName, function (err, isMember) {
              if (err) {
                throw new NotFoundException(err.toString())
              }
              if (isMember) {
                group = groupName
              }
            });
          })
        });
      } else {
        throw new UnauthorizedException(err.toString())
      }
    });

    return await new Promise((resolve, reject) => setTimeout(() => {
      if(isAuthenticated) {
        resolve({
          isAuthenticated: isAuthenticated,
          group: group,
          profile: profile
        })
      } else {
        reject("rejected")
      }
      
    
    }, 1000))
  }
  async signin(username, password): Promise<{ accessToken: string }> {
    const user: any = await this.authenticateUser(username, password)
    const isAuthenticated = user.isAuthenticated
    const group = user.group
    const userPrincipalName = user.profile.userPrincipalName
    const lastName = user.profile.sn
    const firstName = user.profile.givenName
    const description = user.profile.description
    const fullName = user.profile.givenName + ' ' + user.profile.sn

    const payload: JwtPayload = { isAuthenticated, group, userPrincipalName, lastName, firstName, fullName, description }
    const accessToken = await this.jwtService.sign(payload)

    return { accessToken }
  }
}